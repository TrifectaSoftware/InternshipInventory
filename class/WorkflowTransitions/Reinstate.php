<?php

class Reinstate extends WorkflowTransition {
    const sourceState = 'CancelledState';
    const destState   = 'NewState';
    const actionName  = 'Reinstate';

    public function getAllowedPermissionList(){
        return array('dept_approver', 'sig_auth');
    }
    
    public function getActionName()
    {
        return self::actionName;
    }
    
    public function getSourceState(){
        return self::sourceState;
    }
    
    public function getDestState(){
        return self::destState;
    }
    
    public function getSortIndex(){
        return self::sortIndex;
    }
    
    public function getName(){
        return 'Reinstate';
    }
}

?>