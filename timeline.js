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
                '<div class="timeline-content-container clearfix"><div class="timeline-content"></div></div>'    +
                '<div class="timeline-year-index clearfix"></div>' +
                '<div class="timeline-scrollbar clearfix"></div>';

            var years = [];
            $.each(this.data, function() {
                var y = this[0].getFullYear();
                years.push(y);

                $(".timeline-content", self.el).append('<div class="year">' + this[1] + '</div>');
                $(".timeline-year-index", self.el).append('<a class="year" href="javascript:void(0);">' + y + '</a>');
            });

            var year_width = $(".timeline-content .year").width();
            $(".timeline-content", this.el).width(year_width * years.length);

            $(".timeline-year-index .year", this.el).css({
                "width": $(this.el).width() / years.length
            });
        },

        bind_mouse_events: function() {
            var year_width = $(".timeline-content .year").width();
            var tl = this;
            $(".timeline-year-index .year", this.el).bind(
                "click",
                function() {
                    $(".timeline-content", tl.el).animate({
                        "marginLeft": -1 * year_width * $(".timeline-year-index .year", tl.el).index(this)
                    });
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
