if (!jQuery) { throw("Timeline requires jQuery"); }

(function($){
    var Timeline = function(args) {
        this.init(args);
        return this;
    };

    Timeline.prototype = {
        /*
         * data: an array of two-element arrays
         *   the first ones are Date objects, the second ones are strings of html content
         *
         *   eg: [ [t1, html1], [t2, html2] ]
         *
         *   If absent, it is assumed that the required html structure is already in the document.
         */
        init: function(args) {
            if ( !args.el ) throw("Cannot initialize a Timeline without an element (the 'el' argument)");

            this.el = args.el;
            if (args.scrollers) {
                if (args.scrollers[0] && args.scrollers[1]) {
                    if ( $(args.scrollers[0]).size() != 0 && $(args.scrollers[1]).size() ) {
                        this.scrollers = args.scrollers;
                    }
                    else {
                        throw("One (or both) of the scroller elements is missing.");
                    }
                }
                else {
                    throw("Scrollers should be given as an array of two elements, they can be either css selector strings, or the element objects.");
                }
            }

            if ( args.data ) {
                this.data = args.data;
                this.build();
            }

            this.setup_style();
            this.bind_mouse_events();
        },

        // Construct any necessary html elements for this timeline
        build: function() {
            var self = this;

            this.el.innerHTML =
                '<div class="timeline-wrapper clearfix"><div class="timeline-band"></div></div>' +
                '<div class="timeline-year-index-wrapper clearfix"><div class="timeline-year-index clearfix"></div></div>' +
                '<div class="timeline-scrollbar clearfix"></div>';

            var years = [];
            $.each(this.data, function() {
                var y = this[0].getFullYear();
                years.push(y);

                $(".timeline-band", self.el).append('<div class="timeline-content">' + this[1] + '</div>');
                $(".timeline-year-index", self.el).append('<a class="timeline-year" href="javascript:void(0);">' + y + '</a>');
            });
        },

        setup_style: function() {
            var self = this;

            var band_width = 0;
            $(".timeline-band .timeline-content", self.el).each(function() {
                band_width += $(this).outerWidth(true);
            });
            $(".timeline-band", self.el).width( band_width );

            var year_index_width = 0;
            $(".timeline-year-index .timeline-year", self.el).each(function() {
                year_index_width += $(this).outerWidth(true);
            });
            $(".timeline-year-index", self.el).width( year_index_width );
        },

        bind_mouse_events: function() {
            if (this.scrollers) this.bind_mouse_events_of_scrollers()
            else this.bind_mouse_events_of_index();
        },

        bind_mouse_events_of_scrollers: function() {
            if (!this.scrollers) return;
            var self = this;

            var $bands = $(".timeline-band, .timeline-year-index", self.el);
            var scrolling;
            $(this.scrollers[0]).hover(
                function() {
                    $bands.stop();
                    $bands.animate({"margin-left": 0}, 3000);
                },
                function() {
                    $bands.stop();
                }
            );

            $(this.scrollers[1]).hover(
                function() {
                    $bands.stop();
                    $bands.each(function() {
                        $(this).animate(
                            {"margin-left": -1 * ( $(this).outerWidth() - $(".timeline-wrapper", self.el).outerWidth() ) },
                            3000
                        );
                    });
                },
                function() {
                    $bands.stop();
                }
            );
        },

        bind_mouse_events_of_index: function() {
            var self = this;

            var year_width = $(".timeline-band .timeline-content", self.el).width();

            var year_divs = $(".timeline-year-index .timeline-year", self.el).size();
            var year_divs_in_viewport  = $(self.el).width()/year_width;
            var middle_ordinal = parseInt( year_divs_in_viewport/2 ) + 1;

            $(".timeline-year-index .timeline-year", this.el).bind(
                "click",
                function() {
                    var i = $(".timeline-year-index .timeline-year", self.el).index(this);

                    var l;
                    if (i < middle_ordinal) {
                        l = 0;
                    }
                    else if (i > year_divs - parseInt(year_divs_in_viewport)) {
                        l = -1 * year_width * (year_divs - year_divs_in_viewport);
                    }
                    else {
                        l = -1 * year_width * (i - middle_ordinal + 1);
                    }

                    $(".timeline-band", self.el).animate({"marginLeft": l});
                    return false;
                }
            );

            var $scrollbar = $(".timeline-scrollbar", self.el);

            var scrollbar_width = $scrollbar.width();
            var scrollbar_offset = $scrollbar.offset();
            var timeline_band_width = $(".timeline-band", self.el).width();
            var year_index_width = $(".timeline-year-index", self.el).width();

            var threshold_left  = 100;
            var threshold_right = 100;
            scrollbar_width -= (threshold_left + threshold_right);

            var marginLeft = function(x, w) {
                if (x < threshold_left) {
                    return 0;
                }
                x-=  threshold_left;

                if (x > scrollbar_width) {
                    x = scrollbar_width;
                }

                var x_percentage = x / scrollbar_width;
                var l = -1 * x_percentage * (w - scrollbar_width - threshold_left - threshold_right);

                return l;
            };

            $(".timeline-year-index", self.el).bind("mousemove", function(e) {
                var x = e.pageX - scrollbar_offset.left;

                $(".timeline-band", self.el).css({
                    "marginLeft": marginLeft(x, timeline_band_width)
                });

                $(".timeline-year-index", self.el).css({
                    "marginLeft": marginLeft(x, year_index_width)
                });
            });

        }
    };

    $.fn.timeline = function (args) {
        this.each(function() {
            var args_ext = $.extend({}, args);
            args_ext.el = this;
            var tl = new Timeline(args_ext);
            $(this).data("Timeline", tl);
        });
    };
})(jQuery);
