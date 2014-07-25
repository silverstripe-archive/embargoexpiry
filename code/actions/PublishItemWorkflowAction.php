<?php
/**
 * Publishes an item
 *
 * @author     marcus@silverstripe.com.au
 * @license    BSD License (http://silverstripe.org/bsd-license/)
 * @package    embargoexpiry
 * @subpackage actions
 */
class PublishItemWorkflowAction extends WorkflowAction {

	/**
	 * @var array $db
	 */
	private static $db = array(
		'PublishDelay' => 'Int'
	);

	/**
	 * Executes the workflow action instance by creating publish or unpublish queued jobs
	 *
	 * @todo remove DesiredPublishDate and DesiredUnpublishDate features as they are not used
	 * @param WorkflowInstance $workflow
	 */
	public function execute(WorkflowInstance $workflow) {
		if (!$target = $workflow->getTarget()) {
			return true;
		}

		if (class_exists('AbstractQueuedJob') && $this->PublishDelay) {
			$job   = new WorkflowPublishTargetJob($target);
			$days  = $this->PublishDelay;
			$after = date('Y-m-d H:i:s', strtotime("+$days days"));
			singleton('QueuedJobService')->queueJob($job, $after);
		} else if ($target->hasExtension('WorkflowEmbargoExpiryExtension')) {
			// setting future date stuff if needbe

			// set this value regardless
			$target->UnPublishOnDate = $target->DesiredUnPublishDate;
			$target->DesiredUnPublishDate = '';
			if ($target->DesiredPublishDate) {
				$target->PublishOnDate = $target->DesiredPublishDate;
				$target->DesiredPublishDate = '';
				$target->write();
			} else {
				$target->doPublish();
			}
		} else {
			$target->doPublish();
		}

		return true;
	}

	/**
	 * @return FieldList Returns a TabSet for usage within the CMS
	 */
	public function getCMSFields() {
		$fields = parent::getCMSFields();

		if (class_exists('AbstractQueuedJob')) {
			$before = _t('PublishItemWorkflowAction.DELAYPUBDAYSBEFORE', 'Delay publication ');
			$after  = _t('PublishItemWorkflowAction.DELAYPUBDAYSAFTER', ' days');

			$fields->addFieldToTab('Root.Main', new FieldGroup(
				_t('PublishItemWorkflowAction.PUBLICATIONDELAY', 'Publication Delay'),
				new LabelField('PublishDelayBefore', $before),
				new NumericField('PublishDelay', ''),
				new LabelField('PublishDelayAfter', $after)
			));
		}

		return $fields;
	}

	/**
	 * Publish action allows a user who is currently assigned at this point of the workflow to
	 *
	 * @param  DataObject $target
	 * @return bool
	 */
	public function canPublishTarget(DataObject $target) {
		return true;
	}
}
