module.exports = {
    global: "",
    container: "",
    menuItems: {},
    menuItemChildren: {},
    currentView: "",
    data: {},
    init: function(_global, _container, _menuItems, _currentView, _data) {
        try {
            var that = this;
            that.clearProperties();
            that.global = _global;
            that.container = _container;
            that.data = _data;
            _.each(_menuItems, function(menuItem) {
                that.menuItems[menuItem.id] = menuItem;
                that.menuItemChildren[menuItem.id] = menuItem.getChildren();
                menuItem.addEventListener("click", that.sideMenuClick);
            });
            that.currentView = _currentView;
        } catch (error) {
            CloudClock.error(error);
        }
    },
    sideMenuClick: function() {
        try {
            if (CloudClock.APIcallInProgress) return false;
            var indice = this.viewToLoad.indexOf("_");
            CloudClock.dispatcher.route(CloudClock.sideMenu.global, CloudClock.sideMenu.container, this.viewToLoad, CloudClock.sideMenu.currentView, CloudClock.sideMenu.data, false);
            "managerOptions" === CloudClock.sideMenu.global && "managerOptions_reports" === this.viewToLoad && CloudClock.sideMenu.hideSidebar();
            CloudClock.sideMenu.currentView = this.viewToLoad.substr(indice + 1);
            CloudClock.sideMenu.removeActiveState();
            CloudClock.sideMenu.addActiveState(this);
        } catch (error) {
            CloudClock.error(error);
        }
    },
    hideSidebar: function() {
        CloudClock.managerOptions.sidebarHeader.setText(">");
        CloudClock.managerOptions.sidebarHeader.addEventListener("click", CloudClock.sideMenu.showSidebar);
        CloudClock.managerOptions.settingsLbl.hide();
        CloudClock.managerOptions.peopleLbl.hide();
        CloudClock.managerOptions.departmentsLbl.hide();
        CloudClock.managerOptions.employeesLbl.hide();
        CloudClock.managerOptions.reportsLbl.hide();
        CloudClock.managerOptions.sidebar.animate({
            width: "5%"
        });
        CloudClock.managerOptions.managerOptionsContent.animate({
            width: "95%",
            left: "5%"
        });
    },
    showSidebar: function() {
        CloudClock.managerOptions.sidebarHeader.setText("Manager Options");
        CloudClock.managerOptions.sidebarHeader.removeEventListener("click", CloudClock.sideMenu.showSidebar);
        CloudClock.managerOptions.settingsLbl.show();
        CloudClock.managerOptions.peopleLbl.show();
        CloudClock.managerOptions.departmentsLbl.show();
        CloudClock.managerOptions.employeesLbl.show();
        CloudClock.managerOptions.reportsLbl.show();
        CloudClock.managerOptions.sidebar.animate({
            width: "30%"
        });
        CloudClock.managerOptions.managerOptionsContent.animate({
            width: "70%",
            left: "30%"
        });
    },
    removeActiveState: function() {
        try {
            console.log("remove active state");
            var that = this;
            console.log(that.global);
            _.each(that.menuItems, function(menuItem) {
                var children = that.menuItemChildren[menuItem.id];
                CloudClock[that.global].removeClass(CloudClock[that.global][menuItem.id], "active");
                CloudClock[that.global].removeClass(CloudClock[that.global][children[1].id], "activeLbl");
                CloudClock[that.global][children[0].id].setImage("/images/icons/" + menuItem.id + "-32-blk.png");
            });
        } catch (error) {
            CloudClock.error(error);
        }
    },
    addActiveState: function(_menuItem) {
        try {
            var that = this;
            var children = that.menuItemChildren[_menuItem.id];
            console.log(that.global);
            CloudClock[that.global].addClass(CloudClock[that.global][_menuItem.id], "active");
            CloudClock[that.global].addClass(CloudClock[that.global][children[1].id], "activeLbl");
            CloudClock[that.global][children[0].id].setImage("/images/icons/" + _menuItem.id + "-32-white.png");
        } catch (error) {
            CloudClock.error(error);
        }
    },
    clearProperties: function() {
        try {
            var that = this;
            that.global = "";
            that.container = "";
            that.menuItems = {};
            that.menuItemChildren = {};
            that.currentView = "";
            that.data = {};
        } catch (error) {
            CloudClock.error(error);
        }
    }
};