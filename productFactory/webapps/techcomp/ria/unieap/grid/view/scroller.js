dojo.provide('unieap.grid.view.scroller');

dojo.declare('unieap.grid.view.scroller.base', null, {
	
	rowCount: 0,
	keepRows: -1,
	defaultRowHeight: 21,
	
	constructor: function() {
		this.pageHeights = [];
		this.stack = [];
	},
	
	invalidate: function() {
		this.invalidateNodes();
		this.pageHeights = [];
		this.height = (this.pageCount ? (this.pageCount - 1)* this.pageHeight + this.calcLastPageHeight() : 1);
		this.resize();
	},
	// abstract interface
	pageExists: function(inPageIndex) {
	},
	measurePage: function(inPageIndex) {
	},
	//每行高度
	getRowHeight : function(node){
	},
	positionPage: function(inPageIndex, inPos) {
	},
	repositionPages: function(inPageIndex) {
	},
	installPage: function(inPageIndex) {
	},
	preparePage: function(inPageIndex, inPos, inReuseNode) {
	},
	renderPage: function(inPageIndex) {
	},
	removePage: function(inPageIndex) {
	},
	// sizing implementation
	calcLastPageHeight: function() {
		if(!this.pageCount){
			return 0;
		}
		var lastPage = this.pageCount - 1;
		var lastPageHeight = ((this.rowCount % this.rowsPerPage)||(this.rowsPerPage)) * this.defaultRowHeight;
		this.pageHeights[lastPage] = lastPageHeight;
		return lastPageHeight;
	},
	updateContentHeight: function(inDh){
		this.height += inDh;
		this.resize();
	},
	updatePageHeight: function(inPageIndex){
		if(this.pageExists(inPageIndex)){
			var oh = this.getPageHeight(inPageIndex);
			var h = (this.measurePage(inPageIndex))||(oh);
			this.pageHeights[inPageIndex] = h;
			if((h)&&(oh != h)){
				this.updateContentHeight(h - oh);
				this.repositionPages(inPageIndex);
			}
		}
	},
	rowHeightChanged: function(inRowIndex){
		this.updatePageHeight(Math.floor(inRowIndex / this.rowsPerPage));
	},
	// scroller core
	invalidateNodes: function(){
		while(this.stack.length){
			this.destroyPage(this.popPage());
		}
	},
	createPageNode: function(){
		var p = document.createElement('div');
		p.style.position = 'absolute';
		p.style.width = '100%';
		p.style.left = '0';
		return p;
	},
	getPageHeight: function(inPageIndex){
		var ph = this.pageHeights[inPageIndex];
		return (ph !== undefined ? ph : this.pageHeight);
	},
	// FIXME: this is not a stack, it's a FIFO list
	pushPage: function(inPageIndex){
		return this.stack.push(inPageIndex);
	},
	popPage: function(){
		return this.stack.shift();
	},
	findPage: function(inTop){
		var i = 0, h = 0;
		for(var ph = 0; i<this.pageCount; i++, h += ph){
			ph = this.getPageHeight(i);
			if(h + ph >= inTop){
				break;
			}
		}
		this.page = i;
		this.pageTop = h;
	},
	buildPage: function(inPageIndex, inReuseNode, inPos){
		this.preparePage(inPageIndex, inReuseNode);
		this.positionPage(inPageIndex, inPos);
		// order of operations is key below
		this.installPage(inPageIndex);
		this.renderPage(inPageIndex);
		// order of operations is key above
		this.pushPage(inPageIndex);
	},
	needPage: function(inPageIndex, inPos){
		
		var h = this.getPageHeight(inPageIndex), oh = h;
		if(!this.pageExists(inPageIndex)){
			
			this.buildPage(inPageIndex, (this.keepPages)&&(this.stack.length >= this.keepPages), inPos);
			h = this.measurePage(inPageIndex) || h;
			this.pageHeights[inPageIndex] = h;
			
			if(h && (oh != h)){
				this.updateContentHeight(h - oh)
			}
		}else{
			this.positionPage(inPageIndex, inPos);
		}
		return h;
	},
	scroll: function(inTop){
		this.findPage(inTop);
		var h = this.height;
		var b = this.getScrollBottom(inTop);
		for(var p=this.page, y=this.pageTop; (p<this.pageCount)&&((b<0)||(y<b)); p++){
			y += this.needPage(p, y);
		}
		this.firstVisibleRow = this.getFirstVisibleRow(this.page, this.pageTop, inTop);
		this.lastVisibleRow = this.getLastVisibleRow(p - 1, y, b);
		// indicates some page size has been updated
		if(h != this.height){
			this.repositionPages(p-1);
		}
		return inTop + this.windowHeight <= this.height ?  inTop : ((inTop = this.height - this.windowHeight) <= 0 ? 0 : inTop);
	},
	getScrollBottom: function(inTop) {
		return (this.windowHeight >= 0 ? inTop + this.windowHeight : -1);
	}
	
});

dojo.declare('unieap.grid.view.scroller', unieap.grid.view.scroller.base, {
	// virtual rendering interface
	renderRow: function(inRowIndex, inPageNode){
	},
	removeRow: function(inRowIndex){
	},
	// page node operations
	getDefaultNodes: function(){
		return this.pageNodes;
	},
	getDefaultPageNode: function(inPageIndex){
		return this.getDefaultNodes()[inPageIndex];
	},
	positionPageNode: function(inNode, inPos){
		inNode.style.top = inPos + 'px';
	},
	getPageNodePosition: function(inNode){
		return inNode.offsetTop;
	},
	repositionPageNodes: function(inPageIndex, inNodes){
		var last = 0;
		for(var i=0; i<this.stack.length; i++){
			last = Math.max(this.stack[i], last);
		}
		var n = inNodes[inPageIndex];
		var y = (n ? this.getPageNodePosition(n) + this.getPageHeight(inPageIndex) : 0);
		
		for(var p=inPageIndex+1; p<=last; p++){
			n = inNodes[p];
			if(n){
				if(this.getPageNodePosition(n) == y){
					return;
				}
				this.positionPage(p, y);
			}
			y += this.getPageHeight(p);
		}
	},
	invalidatePageNode: function(inPageIndex, inNodes){
		var p = inNodes[inPageIndex];
		if(p){
			delete inNodes[inPageIndex];
			this.removePage(inPageIndex, p);
			unieap.grid.cleanNode(p);
			p.innerHTML = '';
		}
		return p;
	},
	preparePageNode: function(inPageIndex, inReusePageIndex, inNodes){
		var p = (inReusePageIndex === null ? this.createPageNode() : this.invalidatePageNode(inReusePageIndex, inNodes));
		p.pageIndex = inPageIndex;
		p.id = 'page-' + inPageIndex;
		inNodes[inPageIndex] = p;
	},
	// implementation for page manager
	pageExists: function(inPageIndex){
		return Boolean(this.getDefaultPageNode(inPageIndex));
	},
	measurePage: function(inPageIndex){
		if (inPageIndex<this.pageCount-1) {
			return this.rowsPerPage*this.defaultRowHeight;
		} else {
			return (this.rowCount-this.rowsPerPage*(this.pageCount-1))*this.defaultRowHeight;
		}
		//	return this.getDefaultPageNode(inPageIndex).offsetHeight;
	},
	repositionPages: function(inPageIndex){
		this.repositionPageNodes(inPageIndex, this.getDefaultNodes());
	},
	// scroll control
	getPageRow: function(inPage){
		return inPage * this.rowsPerPage;
	},
	getLastPageRow: function(inPage){
		return Math.min(this.rowCount, this.getPageRow(inPage + 1)) - 1;
	},
	getFirstVisibleRowNodes: function(inPage, inPageTop, inScrollTop, inNodes){
		var row = this.getPageRow(inPage);
		var rows = unieap.grid.divkids(inNodes[inPage]);
		for(var i=0,l=rows.length; i<l && inPageTop<inScrollTop; i++, row++){
			inPageTop += this.getRowHeight(rows[i]);
		}
		return (row ? row - 1 : row);
	},
	getFirstVisibleRow: function(inPage, inPageTop, inScrollTop){
		if(!this.pageExists(inPage)){
			return 0;
		}
		return this.getFirstVisibleRowNodes(inPage, inPageTop, inScrollTop, this.getDefaultNodes());
	},
	getLastVisibleRowNodes: function(inPage, inBottom, inScrollBottom, inNodes){
		var row = this.getLastPageRow(inPage);
		var rows = unieap.grid.divkids(inNodes[inPage]);
		for(var i=rows.length-1; i>=0 && inBottom>inScrollBottom; i--, row--){
			inBottom -= this.getRowHeight(rows[i]);
		}
		return row + 1;
	},
	getLastVisibleRow: function(inPage, inBottom, inScrollBottom){
		if(!this.pageExists(inPage)){
			return 0;
		}
		return this.getLastVisibleRowNodes(inPage, inBottom, inScrollBottom, this.getDefaultNodes());
	},
	findTopRowForNodes: function(inScrollTop, inNodes){
		var rows = unieap.grid.divkids(inNodes[this.page]);
		for(var i=0,l=rows.length,t=this.pageTop,h; i<l; i++){
			h = this.getRowHeight(rows[i]);
			t += h;
			if(t >= inScrollTop){
				this.offset = h - (t - inScrollTop);
				return i + this.page * this.rowsPerPage;
			}
		}
		return -1;
	},
	findScrollTopForNodes: function(inRow, inNodes){
		var rowPage = Math.floor(inRow / this.rowsPerPage);
		var t = 0;
		for(var i=0; i<rowPage; i++){
			t += this.getPageHeight(i);
		}
		this.pageTop = t;
		this.needPage(rowPage, this.pageTop);
		if (inNodes[rowPage]) {
			var rows = unieap.grid.divkids(inNodes[rowPage]);
			var r = inRow - this.rowsPerPage * rowPage;
			for(var i=0,l=rows.length; i<l && i<r; i++){
				t += this.getRowHeight(rows[i]);
			}
			return t;
		} else {
			//means this row doesn't exist
			return -1;
		}
		
	},
	findTopRow: function(inScrollTop){
		return this.findTopRowForNodes(inScrollTop, this.getDefaultNodes());
	},
	findScrollTop: function(inRow){
		return this.findScrollTopForNodes(inRow, this.getDefaultNodes());
	}
});

dojo.declare('unieap.grid.view.scroller.columns', unieap.grid.view.scroller, {
	setContentNodes: function(inNodes) {
		this.contentNodes = inNodes;
		this.colCount = (this.contentNodes ? this.contentNodes.length : 0);
		this.pageNodes = [];
		for(var i=0; i<this.colCount; i++) {
			this.pageNodes[i] = [];
		}
	},
	
	init: function(inRowCount, inKeepRows, inRowsPerPage, inDefaultRowHeight) {
		switch(arguments.length){
			case 4: this.defaultRowHeight = inDefaultRowHeight;
			case 3: this.rowsPerPage = inRowsPerPage;
			case 2: this.keepRows = inKeepRows;
			case 1: this.rowCount = inRowCount;
		}
		this.pageHeight = this.defaultRowHeight * this.rowsPerPage;
		//this.pageHeight = this.defaultRowHeight * Math.min(this.rowsPerPage, this.rowCount);
		this.pageCount = Math.ceil(this.rowCount / this.rowsPerPage);
		this.keepPages = Math.max(Math.ceil(this.keepRows / this.rowsPerPage), 2);
		this.invalidate();
	},
	
	updateRowCount: function(inRowCount) {
		this.invalidateNodes();
		this.rowCount = inRowCount;
		// update page count, adjust document height
		var oldPageCount = this.pageCount;
		this.pageCount = Math.ceil(this.rowCount / this.rowsPerPage);
		if(this.pageCount < oldPageCount){
			for(var i=oldPageCount-1; i>=this.pageCount; i--) {
				this.height -= this.getPageHeight(i);
				delete this.pageHeights[i]
			}
		}else if(this.pageCount > oldPageCount){
			this.height += this.pageHeight * (this.pageCount - oldPageCount - 1) + this.calcLastPageHeight();
		}
		this.resize();
	},
	
	getDefaultNodes: function() {
		//return this.pageNodes[0] || [];
		return this.pageNodes[this.pageNodes.length-1] || [];
	},
	
	scroll: function(inTop) {
		if(this.colCount){
			return unieap.grid.view.scroller.prototype.scroll.call(this, inTop);
		}
		return 0;
	},
	resize: function() {
		for(var i=0; i<this.colCount; i++) {
			unieap.grid.setStyleHeightPx(this.contentNodes[i], this.height);
		}
	},
	
	// implementation for page manager
	positionPage: function(inPageIndex, inPos) {
		for(var i=0; i<this.colCount; i++){
			this.positionPageNode(this.pageNodes[i][inPageIndex], inPos);
		}
	},
	preparePage: function(inPageIndex, inReuseNode) {
		var p = (inReuseNode ? this.popPage() : null);
		for(var i=0; i<this.colCount; i++){
			this.preparePageNode(inPageIndex, p, this.pageNodes[i]);
		}
	},
	installPage: function(inPageIndex) {
		for(var i=0; i<this.colCount; i++){
			this.contentNodes[i].appendChild(this.pageNodes[i][inPageIndex]);
		}
	},
	destroyPage: function(inPageIndex) {
		for(var i=0; i<this.colCount; i++){
			unieap.grid.removeNode(this.invalidatePageNode(inPageIndex, this.pageNodes[i]));
		}
	},
	removePage: function(inPageIndex) {
		for(var i=0, j=inPageIndex*this.rowsPerPage; i<this.rowsPerPage; i++, j++) {
			this.removeRow(j);
		}
	},
	renderPage: function(inPageIndex) {
		var nodes = [];
		for(var i=0; i<this.colCount; i++){
			nodes[i] = this.pageNodes[i][inPageIndex];
		}
		//this.renderRows(inPageIndex*this.rowsPerPage, this.rowsPerPage, nodes);
		for(var i=0, j=inPageIndex*this.rowsPerPage; (i<this.rowsPerPage)&&(j<this.rowCount); i++, j++) {
			this.renderRow(j, nodes);
		}
	},
	getRowHeight : function(node){
		return this.defaultRowHeight;
		//return node.offsetHeight;
	}
});