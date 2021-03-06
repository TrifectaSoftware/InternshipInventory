<?php

namespace Intern\UI;

\PHPWS_Core::initModClass('notification', 'NQ.php');

/**
 * Intern_NotifyUI
 *
 * Displays all notifications pushed on intern's NQ.
 *
 * @author Robert Bost <bostrt at tux dot appstate dot edu>
 */
class NotifyUI implements UI
{
    const SUCCESS   = 0;
    const ERROR     = 1;
    const WARNING   = 2;
    const UNKNOWN   = 3;

    /**
     * Pop all notifications from NQ. Get the type for use with CSS.
     * @return - Properly styled notifications.
     */
    public function display()
    {
        $notifications = \NQ::popAll('intern');
        $tags = array();

        foreach($notifications as $notification)
        {
            $type = self::getType($notification);
            $tags['NOTIFICATIONS'][][$type] = $notification->toString();
        }

        $content = \PHPWS_Template::process($tags, 'intern', 'notification.tpl');

        return $content;
    }

    private static function getType(\Notification $n)
    {
        switch($n->getType()){
            case NotifyUI::SUCCESS:
                return 'SUCCESS';
            case NotifyUI::ERROR:
                return 'ERROR';
            case NotifyUI::WARNING:
                return 'WARNING';
            default:
                return 'UNKNOWN';
        }
    }
}
