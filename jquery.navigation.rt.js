/*
   日期：2019-01-29
   
   作者：任涛

   说明：导航插件
*/

(function($) {
	$.fn.navigation = function(obj, param, sucFun, failFun) {
		this.files = [];
		if(typeof(obj) === "string") {
			//			return $.fn.navigation.methods[obj](this, param, sucFun, failFun);
			return $.fn.navigation.methods[obj](param, sucFun, failFun);
		} else { //初始化
			var options = obj || {};

			return this.each(function() {
				var newOptions = $.data(this, "navigation");
				var opts;

				if(newOptions) {
					opts = $.extend(newOptions.options, options);
					newOptions.options = opts;
				} else {

					$.data(this, "navigation", {
						options: $.extend({}, $.fn.navigation.defaults, obj)
					});
					init(this);
				}
			});
		}
	}
	//初始化方法
	function init(target) {
		$(target).addClass("hgt_category_parent");
		var options = $(target).data("navigation").options;

		var normalStartTop = options.normalStartTop;
		var normalItemTop = options.normalItemTop;

		var selectStartTop = options.selectStartTop;
		var selectItemTop = options.selectItemTop;

		var iconStartTop = options.iconStartTop;
		var iconItemTop = options.iconItemTop;

		var imageBaseUrl = options.imageBaseUrl;

		var data = options.data;
		//var container = $(".hgt_category_parent").eq(0);
		var container = $(target);
		container.html(""); //清空容器内容

		var normalContainer = $("<div>").addClass("hgt_category").appendTo(container); //常规容器

		var selectContainer = $("<div>").addClass("hgt_category").appendTo(container); //选择容器

		var iconContainer = $("<div>").addClass("hgt_category").appendTo(container); //图标容器
		$(data).each(function(i, v) {
			/*常规区域*/
			var normalId = "normal_" + v.id;
			var thisNormalTop = normalStartTop + i * normalItemTop;
			var itemNormal = $("<div id='" + normalId + "' title='" + v.title + "' class='hgt_category_item normalDiv'></div>").appendTo(normalContainer);
			var thisNormalUrl = imageBaseUrl + v.normalImage;
			itemNormal.css({
				"background-image": "url(" + thisNormalUrl + ")",
				"top": thisNormalTop + "px",
				"visibility": "visible"
			})

			/*选择区域*/
			var selectId = "select_" + v.id;
			var thisSelectTop = selectStartTop + i * selectItemTop;
			var itemSelect = $("<div id='" + selectId + "' title='" + v.title + "' class='hgt_category_select selectDiv'></div>").appendTo(selectContainer);
			var thisSelectUrl = imageBaseUrl + v.selectImage;
			itemSelect.css({
				"background-image": "url(" + thisSelectUrl + ")",
				"top": thisSelectTop + "px",
				"visibility": "hidden"
			})

			/*Icon区域*/
			var iconId = "icon_" + v.id;
			var thisIconTop = iconStartTop + i * iconItemTop;
			var itemIcon = $("<div id='" + iconId + "' title='" + v.title + "' class='hgt_category_select_icon iconDiv'></div>").appendTo(iconContainer);
			var thisIconUrl = imageBaseUrl + v.iconImage;
			itemIcon.css({
				"background-image": "url(" + thisIconUrl + ")",
				"top": thisIconTop + "px",
				"visibility": "hidden"
			})
			itemNormal.mouseover(function() {
				$.fn.navigation.methods['over'](v.id);
			})
			itemIcon.mouseleave(function() {
				$.fn.navigation.methods['leave'](v.id);
			})
			itemIcon.on("click", function() {
				$.fn.navigation.methods['click'](v.id, v);
			})

		});
		$(target).data("navigation", options);
	}

	//默认设置
	$.fn.navigation.defaults = {
		"normalStartTop": 10,
		"normalItemTop": 60,

		"selectStartTop": 0,
		"selectItemTop": 40,

		"iconStartTop": 0,
		"iconItemTop": 40,
		"imageBaseUrl": "Data/images/category/",
		data: [],
		selectedObj: [],
		onMenuClick: undefined
	};

	$.fn.navigation.methods = {
		options: function(jq) {
			return $.data(jq[0], "navigation");
		},
		subMenuClick: function(v) {
			$.fn.navigation.methods['updateMenuList'](v);
		},
		updateMenuList: function(v) {
			if(Array.isArray(v) && v.length > 0) {
				var MenuContainer = $(".MenuContainer");
				if(MenuContainer.length == 0) {
					MenuContainer = $("<div class='MenuContainer'>").appendTo(document.body);
				}

				MenuContainer.eq(0).html("");
				var menuItem = $("<div class='MenuItem'></div>").appendTo(MenuContainer);
				$("<div class='arrow_to_left'>").appendTo(menuItem);
				$("<div style='padding-right:40px'>返回上级</div>").appendTo(menuItem);
				menuItem.click(function() {
					MenuContainer.addClass("animated").addClass("bounceOutLeft");
					$(".hgt_category_parent").eq(0).removeClass("bounceOutLeft").addClass("bounceInRight");
				})
				$(v).each(function(index, value) {
					menuItem = $("<div class='MenuItem'></div>").html(value.text).appendTo(MenuContainer);
					menuItem.attr({
						title: value.title
					})
					menuItem.css({
						"animation": "category_menu_item " + (index + 1) * 0.1 + "s"
					});
					if(value.childrens == undefined || (value.childrens && value.childrens.length == 0)) {
						menuItem.click(function() {
							var options = $(".hgt_category_parent").eq(0).data("navigation");
							if(options.onMenuClick) {
								options.onMenuClick(value);
							}
						})
					} else {
						var arrow=$("<div class='arrow_to_top'>").appendTo(menuItem);
						var subMenuItem=$("<div class='subMenuItem'>").appendTo(document.body);
						menuItem.after(subMenuItem);
						menuItem.click(function(){
							var arrow=$(this).children("div").last();
							var sub=$(this).next();
							if(arrow.hasClass("arrow_to_bottom")){
								arrow.removeClass("arrow_to_bottom").addClass('arrow_to_top');
								sub.show();
							}
							else{
								arrow.removeClass("arrow_to_top").addClass('arrow_to_bottom');
								sub.hide();
							}
						})
						var $div = $("<div style='width:100%;padding-left: 20px'>").appendTo(subMenuItem)
						$div.show();
						$.each(value.childrens, function(i, v) {
							var subItem = $("<div class='subItemList' style='background-color:transparent'>").html(v.text).appendTo($div);
							subItem.click(function() {
								var options = $(".hgt_category_parent").eq(0).data("navigation");
								if(options.onMenuClick) {
									options.onMenuClick(v);
								}
							})
						});
					}
				})
				$(".hgt_category_parent").eq(0).addClass("animated").addClass("bounceOutLeft");
				var MenuContainer = $(".MenuContainer").eq(0);
				MenuContainer.removeClass("bounceOutLeft").addClass("bounceInRight");
			} else {
				console.log("更新菜单内容出错：参数格式不正确");
			}

		},

		click: function(id, v) {
			$("div[flag=created]").each(function(index, value) {
				var thisId = $(value).attr("id").split('_')[1];
				if(thisId != id) {
					$.fn.navigation.methods['hide'](thisId);
				}
			})
			var itemNormal = $("#normal_" + id);
			var itemSelect = $("#select_" + id);
			var itemIcon = $("#icon_" + id);
			var flag = itemIcon.attr("flag");
			if(flag == "created") {
				$.fn.navigation.methods['hide'](v.id);
			} else if(flag == "hided") {
				$.fn.navigation.methods['show'](v.id);
			} else {
				$.fn.navigation.methods['create'](id, v);
			}
		},

		create: function(id, v) {
			var itemNormal = $("#normal_" + id);
			var itemSelect = $("#select_" + id);
			var itemIcon = $("#icon_" + id);
			if(v.childrens.length > 0) {
				var path = $("<div class='hgt_category_menu_path'></div>").appendTo(itemSelect);
				var down = $("<div class='hgt_category_menu_down'></div>").appendTo(itemSelect);
				var menu = $("<div class='hgt_category_menu'></div>").appendTo(itemSelect);
				$.each(v.childrens, function(j, jv) {
					var menuItem = $("<div class='hgt_category_menu_item myMenuList'></div>").html(jv.text).appendTo(menu);
					menuItem.attr({
						title: jv.title
					})
					menuItem.css({
						"animation": "category_menu_item " + (j + 1) * 0.1 + "s"
					});
					menuItem.click(function() {
						if(jv.childrens && jv.childrens.length > 0) {
							$.fn.navigation.methods['subMenuClick'](jv.childrens);
						} else {
							var options = $(".hgt_category_parent").eq(0).data("navigation");

							if(options.onMenuClick) {
								options.onMenuClick(jv);
							}
						}

					})
				});
				itemIcon.attr("flag", "created");
			}
		},

		over: function(id) {
			var itemNormal = $("#normal_" + id);
			var itemSelect = $("#select_" + id);
			var itemIcon = $("#icon_" + id);

			itemNormal.css({
				"visibility": "hidden"
			});
			itemSelect.css({
				"visibility": "visible"
			});
			itemIcon.css({
				"visibility": "visible"
			});

		},

		leave: function(id) {
			var itemNormal = $("#normal_" + id);
			var itemSelect = $("#select_" + id);
			var itemIcon = $("#icon_" + id);

			var flag = itemIcon.attr("flag");
			if(flag != "created") {
				itemNormal.css({
					"visibility": "visible"
				});
				itemSelect.css({
					"visibility": "hidden"
				});
				itemIcon.css({
					"visibility": "hidden"
				});
			}
		},
		hide: function(id) {
			var itemNormal = $("#normal_" + id);
			var itemSelect = $("#select_" + id);
			var itemIcon = $("#icon_" + id);

			itemSelect.children().each(function(i, v) {
				$(v).hide();
			})
			itemNormal.css({
				"visibility": "visible"
			});
			itemSelect.css({
				"visibility": "hidden"
			});
			itemIcon.css({
				"visibility": "hidden"
			});
			itemIcon.attr("flag", "hided");

		},
		show: function(id) {
			var itemNormal = $("#normal_" + id);
			var itemSelect = $("#select_" + id);
			var itemIcon = $("#icon_" + id);

			itemSelect.children().each(function(i, v) {
				$(v).show();
			})
			itemNormal.css({
				"visibility": "hidden"
			});
			itemSelect.css({
				"visibility": "visible"
			});
			itemIcon.css({
				"visibility": "visible"
			});
			itemIcon.attr("flag", "created");
		}
	};
})(jQuery)