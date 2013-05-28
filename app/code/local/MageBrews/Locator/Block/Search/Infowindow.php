<?php
/**
 * Location extension for Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @copyright   Copyright (c) 2013 Andrew Kett. (http://www.andrewkett.com)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

class MageBrews_Locator_Block_Search_Infowindow extends Mage_Core_Block_Template
{
    protected $_location;

    public function __construct()
    {
        parent::__construct();
        $this->setTemplate('locator/search/no-results.phtml');
    }

    public function getLocation(){

        if(!isset($this->_location)){
            $this->_location = Mage::getModel('magebrews_locator/location')->load(Mage::app()->getRequest()->getParam('id'));
        }

        return $this->_location;
    }

}
