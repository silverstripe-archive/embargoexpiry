# Embargo Expiry Module

This is stripped down version of the AdvancedWorkflow module. It only includes the embargo-expiry features, all other features have been removed from the original code. 

Note: This is not compatible with the AdvancedWorkflow module!

Forked from [AdvancedWorkflow module](https://github.com/silverstripe-australia/advancedworkflow) (commit:  da4efb25984)

## Overview

A module that provides embargo and expiry dates for scheduled publishing and unpublishing of content items.

Embargo - allow some content changes to only appear as published at some future date.
Expiry - a date-time on which to unpublish some content changes.

## Requirements

 * SilverStripe Framework and CMS 3.1 or newer
 * [Queued Jobs module](https://github.com/nyeholt/silverstripe-queuedjobs) (for embargo/expiry functionality)

## Installation

Add `- WorkflowEmbargoExpiryExtension` extension to your mysite/_config.yml file.

	:::yml
	SiteTree:
	    extensions:
	        - WorkflowEmbargoExpiryExtension

Ensure the [QueuedJobs](https://github.com/nyeholt/silverstripe-queuedjobs)
module is installed and configured correctly.
You should have a cronjob similar to the following in place, running as the webserver user.

	*/1 * * * * cd  && sudo -u www php /sites/default/www/framework/cli-script.php dev/tasks/ProcessJobQueueTask
