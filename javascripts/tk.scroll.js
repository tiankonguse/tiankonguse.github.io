tk.AddMethod(TK,{
    Scroll : function () {
        this._topName = ".js-scroll-top";
        this._topTag = "#_top";
        
        this._downName = ".js-scroll-down";
        this._downTag = "#_down";
        
        this._defaultPage = "/about.html#disqus_container";
    }
});
tk.Composition(TK.Scroll,{
    setDefaultPage : function(url){
        var that = this;
        that._defaultPage = url;
    },
    show : function(name){
        var that = this;
        if(name == "top"){
            $(that._topName).show();
        }
        if(name == "down"){
            $(that._downName).show();
        }
    },
    hide : function(name){
        var that = this;
        if(name == "top"){
            $(that._topName).hide();
        }
        if(name == "down"){
            $(that._downName).hide();
        }
    },
    bind : function(){
        var that = this;
        $(that._topName).click(function(){
            tk.animateGoto($(that._topTag).position().top);
        });
        $(that._downName).click(function(){
            tk.animateGoto($(that._downTag).position().top);
        });
    }
});
tk.Composition(TK.Scroll,{
    "fixScroll": function(){
        function preventDefault(ev) {
          ev.preventDefault();
        }

        document.addEventListener('touchmove', preventDefault, false)

        function isScroller(el) {
          // 判断元素是否为 scroller
          return el.classList.contains('scroller')
        }

        document.body.addEventListener('touchmove', function (ev) {
          var target = ev.target
          if (isScroller(target)) {
            ev.stopPropagation()
          }
        }, false)
    }
});
tk.Composition(TK,{
    scroll : new TK.Scroll()
});
