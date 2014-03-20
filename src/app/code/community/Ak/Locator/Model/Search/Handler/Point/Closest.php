<?php

class Ak_Locator_Model_Search_Handler_Point_Closest extends Ak_Locator_Model_Search_Handler_Point_Abstract
{
    const TYPE = 'closest';

    /**
     * Find the single closest location to a point
     *
     * @param array $params
     * @return Ak_Locator_Model_Resource_Location_Collection
     */
    public function search(Array $params)
    {
        $collection = $this->pointToLocations($params['point'], 50000);
        $collection->getSelect()->limit(1);
        $collection->setSearch($this);

        return $collection;
    }


    /**
     * Validate params
     *
     * @param array $params
     * @return bool
     */
    public function isValidParams(array $params)
    {
        if (isset($params['point']) && get_class($params['point']) == 'Ak_Locator_Model_Search_Handler_Point_Closest') {
            return true;
        }

        return false;
    }
}
