function $ff10b73afb6f6841$var$getProductHtml(t,e,a){const c=`/search?q=${t}|${e}&view=oz-related-product-block-html`;$.getJSON(c,{}).done((function(e){!function(t,e,a){let c=$(t.product_block);c.find(".oz-related-products-swatches--li").removeClass("active"),c.find(`.oz-related-products-swatch[data-handle="${a}"]`).parent().addClass("active");const o=e.attr("style");c.attr("style",o),e.replaceWith(c),document.dispatchEvent(new Event("cs-rerendered"))}(e,a,t),$ff10b73afb6f6841$var$onCustomSwatchClicked(),document.dispatchEvent(new Event("vp-rerender"))})).fail((function(t,e,a){var c=e+", "+a+e;console.log("Get swatch failed: "+c)}))}function $ff10b73afb6f6841$var$onCustomSwatchClicked(){$(".oz-collection-swatch.oz-related-products-swatch:not(.oz-swatch-initialised)").on("click",(function(t){const e=$(this).parent(),a=e.closest(".cs-product-container"),c=a.attr("data-cs-params"),o=$(this).data("handle");!e.hasClass("active")&&a&&$ff10b73afb6f6841$var$getProductHtml(o,c,a)})).addClass("oz-swatch-initialised")}window.addEventListener("load",(()=>{console.log("*** TOZ Swatches app - version: 3.0.1"),$ff10b73afb6f6841$var$onCustomSwatchClicked(),document.addEventListener("cs-rerender",$ff10b73afb6f6841$var$onCustomSwatchClicked)}));