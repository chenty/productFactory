 /*** @author shify * @creationTime 2014-07-01 16:43:44 * @modificationTime 2014-08-15 18:34:19 * @version 1.0.0* @generated */dojo.provide("_security.page.page_resource_edit_unieap.Processor");dojo.declare("_security.page.page_resource_edit_unieap.Processor",unieap.view.Processor, {editPageResource: function(pageResource,_load,_error ){return this.run({ processorName:"editPageResource", uParameters:[{name:"pageResource",type:"pojo",javaType:"",value:pageResource}],viewName:"page_resource_edit_unieap",loadSuccessed:this.view.editPageResourceSuccess,loadFailed:this.view.editPageResourceError,boInvoked:{dcID:"security",boID:"security_pageResource.business.xml_bo",methodName:"security.pageResource.editPageResourceForUniEAP"},showLoading:true},_load,_error); }});