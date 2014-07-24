jQuery.entwine("workflow", function($) {

	/*
	 * Simple implementation of the jQuery-UI timepicker widget
	 * @see: http://trentrichardson.com/examples/timepicker/ for more config options
	 *
	 * This will need some more work when it comes to implementing i18n functionality. Fortunately, the library handles these as option-settings quite well.
	 */
	$("#Root_PublishingSchedule").entwine({
		onclick: function() {
			if(typeof $.fn.timepicker() !== 'object' || !$('input.hasTimePicker').length >0) {
				return false;
			}
			var field = $('input.hasTimePicker');
			var defaultTime = function() {
				var date = new Date();
				return date.getHours()+':'+date.getMinutes();
			}
			var pickerOpts = {
				useLocalTimezone: true,
				defaultValue: defaultTime,
				controlType: 'select',
				timeFormat: 'HH:mm'
			};
			field.timepicker(pickerOpts);
			return false;
		},
		onmatch: function(){
			var self = this,
				publishDate = this.find('#PublishOnDate input.date'),
				publishTime = this.find('#PublishOnDate input.time'),
				parent = this.find('#PublishOnDate');

			if(!$('#Form_EditForm_action_publish').attr('disabled')){
				self.checkEmbargo($(publishDate).val(), $(publishTime).val(), parent);

				publishDate.change(function(){
					self.checkEmbargo($(publishDate).val(),$(publishTime).val(), parent);
				});

				publishTime.change(function(){
					self.checkEmbargo($(publishDate).val(), $(publishTime).val(), parent);
				});
			}

			this._super();
		},

		/*
		 * Checks whether an embargo is present.
		 * If an embargo is present, display an altered actions panel,
		 * with a message notifying the user
		 */
		checkEmbargo: function(publishDate, publishTime, parent){

			// Something has changed, remove any existing embargo message
			$('.Actions #embargo-message').remove();

			/*
			 * Fuzzy checking:
			 * There may not be $(#PublishOnXXX input.date) DOM objects = undefined.
			 * There may be $(#PublishOnXXX input.date) DOM objects = val() method may return zero-length.
			 */
			var noPublishDate = (publishDate === undefined || publishDate.length == 0);
			var noPublishTime = (publishTime === undefined || publishTime.length == 0);

			if(noPublishDate && noPublishTime){
				//No Embargo, remove customizations
				$('#Form_EditForm_action_publish').removeClass('embargo');
				$('#Form_EditForm_action_publish').prev('button').removeClass('ui-corner-right');
			} else {

				var link,
					message;

				$('#Form_EditForm_action_publish').addClass('embargo');
				$('#Form_EditForm_action_publish').prev('button').addClass('ui-corner-right');

				if(publishDate === ''){
					//Has time, not date
					message = ss.i18n.sprintf(
						ss.i18n._t('Workflow.EMBARGOMESSAGETIME'),
						publishTime
					);

				}else if(publishTime === ''){
					//has date no time
					message = ss.i18n.sprintf(
						ss.i18n._t('Workflow.EMBARGOMESSAGEDATE'),
						publishDate
					);
				}else{
					//has date and time
					message = ss.i18n.sprintf(
						ss.i18n._t('Workflow.EMBARGOMESSAGEDATETIME'),
						publishDate,
						publishTime
					);
				}

				message = message.replace('<a>','<a href="#" id="workflow-schedule">');

				//Append message with link
				$('.Actions #ActionMenus').after('<p class="edit-info" id="embargo-message">' + message + '</p>');

				//Active link
				this.linkScheduled(parent);
			}

			return false;
		}
	});
});
