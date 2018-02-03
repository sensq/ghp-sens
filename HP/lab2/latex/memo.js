//サイズのボックス内でEnter押すとLaTeXを実行 ～html側～
<input type="text" name="box" id="box" size="10" onKeyPress="return submitStop(event);">
</form>

//サイズのボックス内でEnter押すとLaTeXを実行 ～js側～
function submitStop(e){
	if (!e) var e = window.event;
	
	if(e.keyCode == 13){
		/* ここに実行内容 */
		return false;
	}
}