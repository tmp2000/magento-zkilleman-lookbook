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

Element.addMethods({
    bounds: function(element) {
        element = $(element);
        var elemPos = element.cumulativeOffset();
        var elemDim = element.getDimensions();
        return {
            top:    elemPos.top,
            left:   elemPos.left,
            width:  elemDim.width,
            height: elemDim.height
        };
    }
});

var LookbookSlideshow = Class.create();
LookbookSlideshow.prototype = {
    _elem:     null,
    _items:    null,
    _current:  -1,
    _interval: null,
    _options:  null,
    initialize: function(id, options)
    {
        if (!(this._elem = $(id))) {
            return;
        }
        this._items = this._elem.select('li.image');
        if (!this._items.length) {
            return;
        }
        this._options = {
            interval  : 5000,
            direction : 'right',
            fakes     : 2
        };
        if (typeof options == 'object') {
            for (var key in options) {
                this._options[key] = options[key];
            }
        }
        this._initFakes();
        this._initControls();
        this.slide('right', 0);
        this.start();
        this._elem.observe('mouseover', this.stop.bind(this));
        this._elem.observe('mouseout', this.start.bind(this));
        var self = this;
        this._elem.next('button.next').observe('click', function() {
            self.stop();
            self.slide('right');
            self.start();
        });
        this._elem.next('button.previous').observe('click', function() {
            self.stop();
            self.slide('left');
            self.start();
        });
    },
    _initControls: function()
    {
        var self = this;
        this._elem.select('li.image').each(function(image) {
            image.select('div.positioned-tag').each(function(tag) {
                var y = tag.getAttribute('data-y');
                var x = tag.getAttribute('data-x');
                var bounds = tag.bounds();
                y -= bounds.height/2;
                x -= bounds.width/2;
                tag.style.top  = parseInt(y) + 'px';
                tag.style.left = parseInt(x) + 'px';
            });
            image.down('img').observe('mouseenter', function() {
                image.select('div.positioned-tag').each(function(tag) {
                    self._effect(
                        tag,
                        Effect.Appear,
                        'tag-' + tag.getAttribute('data-id')
                    );
                });
                var overlay = image.down('div.overlay');
                self._effect(
                    overlay,
                    Effect.Morph,
                    'overlay-' + image.getAttribute('data-id'),
                    {style: 'bottom: -' + overlay.bounds().height + 'px'}
                );
            });
            image.observe('mouseleave', function() {
                image.select('div.positioned-tag').each(function(tag) {
                    self._effect(
                        tag,
                        Effect.Fade,
                        'tag-' + tag.getAttribute('data-id')
                    );
                });
                self._effect(
                    image.down('div.overlay'),
                    Effect.Morph,
                    'overlay-' + image.getAttribute('data-id'),
                    {style: 'bottom: 0px'}
                );
            });
        });
    },
    _initFakes: function()
    {
        var real,
            fake,
            numFakes = parseInt(this._options.fakes),
            numItems = this._items.length;
        for (var i = 0; i < numFakes; ++i) {
            real = this._items[((numItems - 1) - i)%numItems];
            fake = new Element('li')
                        .addClassName('fake image')
                        .update(real.innerHTML);
            fake.setAttribute('data-id', real.getAttribute('data-id'));
            this._elem.insert({top: fake});
            real = this._items[i%numItems];
            fake = new Element('li')
                        .addClassName('fake image')
                        .update(real.innerHTML);
            fake.setAttribute('data-id', real.getAttribute('data-id'));
            this._elem.insert({bottom: fake});
        }
    },
    _effect: function(elem, effect, scope, options)
    {
        var defaultOptions = {
            duration: 0.25
        }
        if (scope) {
            defaultOptions.queue = {scope: scope};
        }
        if (typeof options == 'object') {
            for (var key in options) {
                defaultOptions[key] = options[key];
            }
        }
        if (defaultOptions.queue && defaultOptions.queue.scope) {
            Effect.Queues.get(defaultOptions.queue.scope).invoke('cancel');
        }
        new effect(elem, defaultOptions);
    },
    _targetOffset: function(item)
    {
        var iBounds = item.bounds();
        var iCenter = iBounds.left + (iBounds.width/2);
        var eBounds = this._elem.bounds();
        var eCenter = eBounds.left + (eBounds.width/2);
        return parseInt(eCenter - iCenter);
    },
    slide: function(direction, duration)
    {
        if (typeof direction == 'undefined' || direction != 'left') {
            direction = 'right';
        }
        if (typeof duration == 'undefined') {
            duration = 0.5;
        }
        var numItems = this._items.length;
        if (this._current != (this._current + numItems)%numItems) { // on a fake
            this._current = (this._current + numItems)%numItems;
            var realItem = this._items[this._current];
            this._elem.style.left = this._targetOffset(realItem) + 'px';
        }
        var item;
        if (direction == 'right') {
            item = this._items[this._current++].next('li.image');
        } else {
            item = this._items[this._current--].previous('li.image');
        }
        var offset = this._targetOffset(item);
        this._effect(
            this._elem,
            Effect.Move,
            this._elem.getAttribute('id') + '-slide',
            {x: offset, mode: 'absolute', duration: duration}
        );
    },
    start: function()
    {
        var intervalFunction = this.slide.bind(this);
        var direction        = this._options.direction;
        var interval         = this._options.interval;
        this._interval       = window.setInterval(
                                    function() {
                                        intervalFunction(direction);
                                    }, interval);
    },
    stop: function()
    {
        if (this._interval) {
            window.clearInterval(this._interval);
            this._interval = null;
        }
    }
};