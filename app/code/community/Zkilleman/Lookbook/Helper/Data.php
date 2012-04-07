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

class Zkilleman_Lookbook_Helper_Data extends Mage_Core_Helper_Abstract
{
    const ORIGINAL_PATH = 'lookbook';
    const CACHE_PATH    = 'lookbook/cache';
    
    public function getMediaBaseDir()
    {
        return Mage::getBaseDir('media') . DS . self::ORIGINAL_PATH;
    }
    
    public function getMediaBaseUrl()
    {
        return Mage::getBaseUrl('media') . self::ORIGINAL_PATH;
    }
    
    public function getCachedMediaBaseDir()
    {
        return Mage::getBaseDir('media') . DS . self::CACHE_PATH;
    }
    
    public function getCachedMediaBaseUrl()
    {
        return Mage::getBaseUrl('media') . self::CACHE_PATH;
    }
    
    public function removeImageFile(Zkilleman_Lookbook_Model_Image $image)
    {
        if (!$image || !$image->getId() || $image->getFile() == '') {
            return false;
        }
        $file = $this->getMediaBaseDir() . $image->getFile();
        if (file_exists($file) && unlink($file)) {
            return true;
        } else {
            return false;
        }
    }
}
