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
         * eg: [ [t1, html1], [t2, html2] ]
         */
        init: function(args) {
            if ( !args.el ) throw("Cannot initialize a Timeline without an element (the 'el' argument)");
            if ( !args.el ) throw("Cannot initialize a Timeline without any data (the 'data' argument)");

            this.el = args.el;
            this.data = args.data;

            this.build();
            this.bind_mouse_events();
        },

        // Construct any necessary html elements for this timeline
        build: function() {
            var self = this;

            this.el.innerHTML =
                '<div class="timeline-wrapper clearfix"><div class="timeline-band"></div></div>'    +
                '<div class="timeline-year-index clearfix"></div>' +
                '<div class="timeline-scrollbar clearfix"></div>';

            var years = [];
            $.each(this.data, function() {
                var y = this[0].getFullYear();
                years.push(y);

                $(".timeline-band", self.el).append('<div class="timeline-content">' + this[1] + '</div>');
                $(".timeline-year-index", self.el).append('<a class="timeline-year" href="javascript:void(0);">' + y + '</a>');
            });

            var year_width = $(".timeline-band .timeline-content").width();
            $(".timeline-band", this.el).width(year_width * years.length);

            $(".timeline-year-index .timeline-year", this.el).css({
                "width": $(this.el).width() / years.length
            });
        },

        bind_mouse_events: function() {
            var year_width = $(".timeline-band .timeline-content").width();
            var self = this;

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
