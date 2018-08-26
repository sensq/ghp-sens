function func_textarea() {
  // 与えられた複数行の文字列を配列に変換して返す関数
  function split_by_line(str){
    return str.replace(/\r\n|\r/g, "\n").split("\n")
  }
  
  // 与えられた配列内で最長のバイト数を計算して返す関数
  function calc_max_byte_length_from_array(array){
    let max = 0
    array.forEach(function(value){
      let len = get_byte_length(value)
      if(max < len){
        max = len
      }
    })
    return max
  }
  
  // 与えられた文字列のバイト数を計算して返す関数
  function get_byte_length(str){
    let count = 0;
    for (let i=0; i<str.length; i++)
    {
      const n = escape(str.charAt(i));
      if (n.length < 4) count++; else count+=2;
    }
    return count;
  }
  
  // 与えられた配列に適切な個数のスペースとコメント記号を付与した配列を返す関数
  function add_comment_sign_to_EOL(array, max, comment_sign){
    const comment = comment_sign  // 行末に追加する文字列
    let ret_array = []
    array.forEach(function(value){
      // 最長の行に合わせたスペース数を計算
      let spaces = ( max - get_byte_length(value) )
      let replacement = (" ".repeat(spaces) + comment)
      ret_array.push( value.replace( /$/, replacement ) )
    })
    return ret_array
  }
  
  // 与えられた配列2つを要素ごとに結合した配列を返す関数
  function concatenate_array(array_left, array_right){
    let ret_array = []
    array_left.forEach(function(value, index){
      if(array_right[index]){
        ret_array.push( value + array_right[index] )
      }
      else{
        ret_array.push(value)
      }
    })
    return ret_array
  }
  
  // 与えられたコメント付き配列からコメントの無い行のコメント記号を削除した配列を返す関数
  function remove_nullcomment_sign(array, comment_sign){
    const nullcomment = new RegExp(" *" + comment_sign + "$")  // 行末に追加する文字列
    let ret_array = []
    array.forEach(function(value){
      ret_array.push( value.replace( nullcomment, "" ) )
    })
    return ret_array
  }
  
  // テキストの行数に合わせてコメントに空行を入れる
  function insert_line_to_textarea(array, num){
    for (let i=array.length; i<=num; i++){
      array.push("")
    }
    return array.join("\n")
  }
  
  // 入力を受け取る
  const src_strings = document.getElementById("src_strings").value
  const comments_area_elem = document.getElementById("src_comments")
  const src_comments = comments_area_elem.value
  const comment_sign = document.getElementById("comment_sign").value
  
  // 文字列を改行でSplitして配列に変換
  const strings_array = split_by_line(src_strings)
  const comments_array = split_by_line(src_comments)
  // 最長行のバイト数を計算
  const max = calc_max_byte_length_from_array(strings_array)
  // 各行の末尾にコメント記号を付与
  const signed_strings_array = add_comment_sign_to_EOL(strings_array, max, comment_sign)
  // コメント配列を結合
  const concatenated_array = concatenate_array(
    signed_strings_array, comments_array
  )
  // コメントの無い行のコメント記号を削除
  const removed_nullcomment_array = remove_nullcomment_sign( concatenated_array, comment_sign )
  
  // 画面に表示
  const out_area_elem = document.getElementById("out_area")
  out_area_elem.value = removed_nullcomment_array.join("\n")
  
  const inserted_line_comments = insert_line_to_textarea(comments_array, strings_array.length-1)
  comments_area_elem.value = inserted_line_comments
}

function set_textarea_div_width() {
  const horizontal_size = document.getElementById("range_horizontal_size").value
  const range_value_elem = document.getElementById("range_horizontal_size_value")
  range_value_elem.value = horizontal_size
  
  document.getElementById("src_strings_div").style.width = (horizontal_size + "px")
  document.getElementById("src_comments_div").style.width = (horizontal_size + "px")
  document.getElementById("out_area_div").style.width = (horizontal_size + "px")
}

function set_textarea_div_height() {
  const vertical_size = document.getElementById("range_vertical_size").value
  const range_value_elem = document.getElementById("range_vertical_size_value")
  range_value_elem.value = vertical_size
  
  document.getElementById("src_strings_div").style.height = (vertical_size + "px")
  document.getElementById("src_comments_div").style.height = (vertical_size + "px")
  document.getElementById("out_area_div").style.height = (vertical_size + "px")
}

function copy_result() {
  const focus_elem = document.getElementById("out_area")
  focus_elem.select()
  document.execCommand('copy')
}

function initialize() {
  document.getElementById("src_strings").value = "sample_1\nsample_22\nsample_333"
  document.getElementById("comment_sign").value = "  # "
  
  document.getElementById("range_horizontal_size").value = parseInt(window.innerWidth * 0.30)
  document.getElementById("range_horizontal_size_value").value = document.getElementById("range_horizontal_size").value
  
  document.getElementById("range_vertical_size").value = parseInt(window.innerHeight - 100)
  document.getElementById("range_vertical_size_value").value = document.getElementById("range_vertical_size").value

  func_textarea()
  set_textarea_div_height()
  set_textarea_div_width()
}

window.onload = function () {
  initialize()
}
