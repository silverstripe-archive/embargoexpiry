# Embargo Expiry Module

Forked from silverstripe-australia/advancedworkflow (da4efb2598482afc176b120bc86e5abe307375bb)
Then modified to remove all the workflow features except the embargo expiry stuff.

## Overview

A module that provides embargo and expiry dates for scheduled publishing and unpublishing of content items.

## Requirements

 * SilverStripe Framework and CMS 3.1 or newer
 * [Queued Jobs module](https://github.com/nyeholt/silverstripe-queuedjobs) (for embargo/expiry functionality)

## Installation

This functionality allows you to embargo some content changes to only appear as published at some future date. To enable it,
add the `EmbargoExpiryExtension`.

	:::yml
	SiteTree:
	    extensions:
	        - WorkflowEmbargoExpiryExtension

Make sure the [QueuedJobs](https://github.com/nyeholt/silverstripe-queuedjobs)
module is installed and configured correctly.
You should have a cronjob similar to the following in place, running as the webserver user.

	*/1 * * * * cd  && sudo -u www php /sites/default/www/framework/cli-script.php dev/tasks/ProcessJobQueueTask

It also allows for an optional subsequent expiry date-time on which to unpublish the content item.