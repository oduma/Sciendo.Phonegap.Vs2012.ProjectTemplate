var newGuid = 0;

$(document).bind('pageinit', function() {

    function ClientModelItems() {
        var self = this;
        self.webApiUrl = "http://localhost/mvcapp4server/api/modelItems";
        self.allData = ko.observableArray();
        self.editMode = ko.observable("+");
        self.DeletesNotSynched = ko.computed(function () {
            var oneDestroy = false;
            $.each(self.allData(), function (index, item) {
                if (item._destroy === true)
                    oneDestroy = true;
            });
            return oneDestroy;
        }, this);

        self.GetAllLocal = function () {
            if (!localStorage["modelItems"]) {
                localStorage["modelItems"] = JSON.stringify([]);
            }
            return JSON.parse(localStorage["modelItems"]);

        };

        Sammy(function () {
            this.get("#:all", function () {
                $.getJSON(self.webApiUrl,{}, function (data,textstatus,jqXhr) {
                    $.each(data, function (index, item) {
                        self.allData.push(item);
                    });
                });
                var ls = self.GetAllLocal();
                $.each(ls, function (index, item) {
                    item.Synched = false;
                    self.allData.push(item);
                });
            });
            this.get('', function () { this.app.runRoute('get', '#all'); });
        }).run();


        self.reduceAction = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();

        };
        //self.SaveSuccess = function (result,textstatus,jqXHR) {

        //    var oldItem;
        //    $.each(self.allData(), function (index, item) {
        //        if (item.ItemId == result.OldId)
        //            oldItem = item;
        //    });
        //    if (jqXHR.statusText === "Created") {
        //        var newItem = { ItemId: result.NewId, ItemName: oldItem.ItemName, ItemDescription: oldItem.ItemDescription, Synched: true };
        //        self.allData.push(newItem);
        //    }
        //    self.allData.remove(oldItem);
        //    self.editMode("+");
        //};

        //self.SynchUpSuccess = function (result,textstatus,jqXHR) {
        //    self.SaveSuccess(result,textstatus,jqXHR);
        //    var ls = self.GetAllLocal();
        //    var itemToDelete;
        //    $.each(ls, function (index, item) {
        //        if (result.OldId == item.ItemId) {
        //            itemToDelete = index;
        //        }
        //    });
        //    ls.splice(itemToDelete,1);
        //    localStorage["modelItems"] = JSON.stringify(ls);
        //};

        //self.SynchUpMultiSuccess = function(result, textstatus, jqXHR) {
        //    $.each(result, function (index, item) {
        //        self.SynchUpSuccess(item, textstatus, jqXHR);
        //    });
        //};

        self.addItem = function (e,f) {
            self.reduceAction(f);
            self.allData.push({ ItemId: newGuid, ItemName: "", ItemDescription: "", Synched: false });
            self.editMode("Save");
        };

        self.cancelEdit = function (e, f) {
            self.reduceAction(f);
            self.allData.remove(self.allData()[self.allData().length-1]);
            self.editMode("+");
        };

        //self.synchUp = function (itemUp, type, callback) {
        //    $.ajax(self.webApiUrl, {
        //        data: ko.toJSON(itemUp),
        //        type: type,
        //        contentType: "application/json",
        //        success: callback
        //    });
        //};

        //self.synchUpItem = function (item) {
        //    self.synchUp(item, "post", self.SynchUpSuccess);
        //};

        self.saveItem = function (e, f) {
            self.reduceAction(f);
            var oldItem = self.allData()[self.allData().length - 1];
            var minItemId = 0;
            var ls = self.GetAllLocal();
            $.each(ls, function (index, item) {
                if(minItemId>item.ItemId) {
                    minItemId = item.ItemId;
                }
            });
            minItemId--;
            var newItem = { ItemId: minItemId, ItemName: oldItem.ItemName, ItemDescription: oldItem.ItemDescription, Synched:false };
            ls.push(newItem);
            localStorage["modelItems"] = JSON.stringify(ls);
            self.allData.remove(oldItem);
            self.allData.push(newItem);
            //self.synchUp(newItem,"post",self.SynchUpSuccess);
            self.editMode("+");

        };

        self.deleteItem = function (item, f) {
            self.reduceAction(f);
            self.allData.destroy(item);
            var items = [];
            items.push(item);
            //self.synchUp(items,"DELETE",self.SynchUpMultiSuccess);
        };

        //self.synchUpAllOfflineDeletes = function() {
        //    var offlineDeletes = [];
        //    $.each(self.allData(), function (index, item) {
        //        if (item._destroy === true)
        //            offlineDeletes.push(item);
        //    });
        //    self.synchUp(offlineDeletes, "DELETE",self.SynchUpMultiSuccess);
        //};
    }

    ko.applyBindings(new ClientModelItems());
});
