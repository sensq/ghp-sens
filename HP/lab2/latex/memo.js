//�T�C�Y�̃{�b�N�X����Enter������LaTeX�����s �`html���`
<input type="text" name="box" id="box" size="10" onKeyPress="return submitStop(event);">
</form>

//�T�C�Y�̃{�b�N�X����Enter������LaTeX�����s �`js���`
function submitStop(e){
	if (!e) var e = window.event;
	
	if(e.keyCode == 13){
		/* �����Ɏ��s���e */
		return false;
	}
}