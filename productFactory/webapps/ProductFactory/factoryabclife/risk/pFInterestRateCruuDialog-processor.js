 /*** @author Neusoft * @creationTime 2016-11-16 09:52:20 * @modificationTime 2017-03-09 09:54:01 * @version 1.0.0* @generated */dojo.provide("_factoryabclife.risk.pFInterestRateCruuDialog.Processor");dojo.declare("_factoryabclife.risk.pFInterestRateCruuDialog.Processor",unieap.view.Processor, {addUpTCurrShare: function(tCurrPriceIntrate,opt,_load,_error ){return this.run({ processorName:"addUpTCurrShare", uParameters:[{name:"tCurrPriceIntrate",type:"pojo",javaType:"",value:tCurrPriceIntrate},{name:"opt",type:"string",javaType:"",value:opt}],viewName:"pFInterestRateCruuDialog",loadSuccessed:this.view.addUpTCurrShareSuccess,boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfInterestRate.business.xml_bo",methodName:"pfInterestRate.addUpTCurrShare"},showLoading:true},_load,_error); },getTUnivrslShare: function(_load,_error ){return this.run({ processorName:"getTUnivrslShare", uParameters:[],viewName:"pFInterestRateCruuDialog",loadSuccessed:this.view.getTUnivrslShareSuccess,syncRequest:true,boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfInterestRate.business.xml_bo",methodName:"pfInterestRate.getTUnivrslShare"},showLoading:true},_load,_error); }});