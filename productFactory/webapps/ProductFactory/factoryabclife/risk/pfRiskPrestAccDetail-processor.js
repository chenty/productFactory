 /*** @author Administrator * @creationTime 2016-07-28 14:36:23 * @modificationTime 2016-09-20 10:58:03 * @version 1.0.0* @generated */dojo.provide("_factoryabclife.risk.pfRiskPrestAccDetail.Processor");dojo.declare("_factoryabclife.risk.pfRiskPrestAccDetail.Processor",unieap.view.Processor, {getAccDetail: function(tClaimGivepayDef,tClaimPayItemDetail,pageNumber,pageSize,_load,_error ){return this.run({ processorName:"getAccDetail", uParameters:[{name:"tClaimGivepayDef",type:"pojo",javaType:"",value:tClaimGivepayDef},{name:"tClaimPayItemDetail",type:"pojo",javaType:"",value:tClaimPayItemDetail},{name:"pageNumber",type:"string",javaType:"",value:pageNumber},{name:"pageSize",type:"string",javaType:"",value:pageSize}],viewName:"pfRiskPrestAccDetail",loadSuccessed:this.view.getAccDetailSuccess,pagingInfo:{pageNumber:1,pageSize:10,calcRecordCount:true},boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfRiskPrestAccDetail.business.xml_bo",methodName:"pfRiskPrestAccDetail.getAccDetails"},serverExportCompatible:true,showLoading:true},_load,_error); },getObjFormulas: function(id,type,_load,_error ){return this.run({ processorName:"getObjFormulas", uParameters:[{name:"id",type:"string",javaType:"",value:id},{name:"type",type:"string",javaType:"",value:type}],viewName:"pfRiskPrestAccDetail",loadSuccessed:this.view.getObjFormulasSuccess,boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfprestduty.business.xml_bo",methodName:"pfprestduty.getTObjFormula"},showLoading:true},_load,_error); },delParamFormulaRelation: function(objSeq,_load,_error ){return this.run({ processorName:"delParamFormulaRelation", uParameters:[{name:"objSeq",type:"string",javaType:"",value:objSeq}],viewName:"pfRiskPrestAccDetail",loadSuccessed:this.view.delParamFormulaRelationSuccess,boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfrelation.business.xml_bo",methodName:"pfrelation.delParamFormulaRelation"},showLoading:true},_load,_error); },addDefautValue: function(tClaimGivepayDef,_load,_error ){return this.run({ processorName:"addDefautValue", uParameters:[{name:"tClaimGivepayDef",type:"pojo",javaType:"",value:tClaimGivepayDef}],viewName:"pfRiskPrestAccDetail",loadSuccessed:this.view.addDefautValueSuccess,boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfRiskPrestAccDetail.business.xml_bo",methodName:"pfRiskPrestAccDetail.addDefautValue"},showLoading:true},_load,_error); },delAccDetail: function(tClaimPayItemDetail,_load,_error ){return this.run({ processorName:"delAccDetail", uParameters:[{name:"tClaimPayItemDetail",type:"pojo",javaType:"",value:tClaimPayItemDetail}],viewName:"pfRiskPrestAccDetail",loadSuccessed:this.view.delAccDetailSuccess,boInvoked:{dcID:"factoryabclife",boID:"factoryabclife_pfRiskPrestAccDetail.business.xml_bo",methodName:"pfRiskPrestAccDetail.delAccDetail"},showLoading:true},_load,_error); }});