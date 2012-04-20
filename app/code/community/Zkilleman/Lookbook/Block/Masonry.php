<?php
/**
 * Zkilleman_Lookbook
 *
 * Copyright (C) 2012 Henrik Hedelund (henke.hedelund@gmail.com)
 *
 * This file is part of Zkilleman_Lookbook.
 *
 * Zkilleman_Lookbook is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Zkilleman_Lookbook is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Zkilleman_Lookbook. If not, see <http://www.gnu.org/licenses/>.
 *
 * @category Zkilleman
 * @package Zkilleman_Lookbook
 * @author Henrik Hedelund <henke.hedelund@gmail.com>
 * @copyright 2012 Henrik Hedelund (henke.hedelund@gmail.com)
 * @license http://www.gnu.org/licenses/gpl.html GNU GPL
 * @link https://github.com/henkelund/magento-zkilleman-lookbook
 */

class Zkilleman_Lookbook_Block_Masonry
    extends Zkilleman_Lookbook_Block_Widget_Abstract
{
    protected $_template = 'lookbook/masonry.phtml';
    
    /**
     * Default portrait image width
     *
     * @var int 
     */
    protected $_defaultPortraitWidth = 170;
    
    /**
     * Width of portrait images
     *
     * @return int 
     */
    public function getPortraitWidth()
    {
        $width = $this->hasData('portrait_width') ?
                    intval($this->getData('portrait_width')) :
                    $this->_defaultPortraitWidth;
        return (int) max(1, $width);
    }
    
    /**
     * Width of landscape images
     *
     * @return int 
     */
    public function getLandscapeWidth()
    {
        $width = $this->hasData('landscape_width') ?
                    intval($this->getData('landscape_width')) :
                    $this->getPortraitWidth();
        return (int) max(1, $width);
    }
    
    /**
     * Image html json array
     *
     * @return string 
     */
    public function getImagesJson()
    {
        $images = $this->getImageCollection();
        if (!$images) {
            return '[]';
        }
        
        $result = array();
        foreach ($images as $image) {
            $result[] = $image->getHtml(
                            $image->isPortrait() ?
                                $this->getPortraitWidth() :
                                $this->getLandscapeWidth());
        }
        return Mage::helper('core')->jsonEncode($result);
    }
    
    /**
     * Url to masonry ajax controller
     *
     * @return string 
     */
    public function getAjaxUrl()
    {
        return $this->getUrl('lookbook/widget_masonry/images');
    }
    
    /**
     * Params for masonry controller
     *
     * @return string 
     */
    public function getAjaxParams()
    {
        $params = array(
            'set_handle', 'tags', 'portrait_width', 'landscape_width', 'page_size'
        );
        $params = array_intersect_key(
                            $this->getData(),
                            array_combine($params, $params));
        return Mage::helper('core')->jsonEncode($params);
    }
}