({
	createModal : function(component, event, helper) {
		component.find('overLayLib').showCustomModal({
                       header: "Application Confirmation",
                       body: "This is test",
                       footer:'Footer',
                       showCloseButton: true,
                       closeCallback: function() {
                           alert('You closed the alert!');
                       }
                   });
	}
})