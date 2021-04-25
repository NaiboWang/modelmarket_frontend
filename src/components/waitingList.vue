<script type="text/javascript">
// 定义一些公共的属性和方法
import {ElMessage} from "element-plus";

var waitingList = initializeList();
function initializeList()
{
  if(localStorage.getItem("waitingList")==null){
    localStorage.setItem("waitingList",JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem("waitingList"));
}
function get(){
  return JSON.parse(localStorage.getItem("waitingList"));
}
function exist(id){
  waitingList = get();
  let exist_OK = false;
  let index = -1;
  for(let i=0;i<waitingList.length;i++)
  {
    if(waitingList[i]["id"] == id){
      exist_OK = true;
      index = i;
      break;
    }
  }
  return exist_OK;
}
function push(item){
  waitingList = get();
  let exist_OK = exist(item["id"]);
  if(exist_OK)
  {
    ElMessage({
      message: "This model already existed in the waiting list",
      type: 'info',
      center: true
    });
  }
  else{
    waitingList.push(item);
    ElMessage({
      message: "This model has been added to the waiting list",
      type: 'success',
      center: true
    });
  }
  localStorage.setItem("waitingList",JSON.stringify(waitingList));
  // state.waitingList = JSON.parse(localStorage.getItem('waitingList'));
}
function remove(item){
  waitingList = get();
  let index = -1;
  for(let i=0;i<waitingList.length;i++)
  {
    if(waitingList[i]["id"] == item["id"]){
      index = i;
      break;
    }
  }
  if(index>=0){
    waitingList.splice(index,1);
    ElMessage({
      message: "This model has been deleted from the waiting list",
      type: 'success',
      center: true
    });
  }else{
    ElMessage({
      message: "This model doesn't exist in the waiting list",
      type: 'error',
      center: true
    });
  }
  localStorage.setItem("waitingList",JSON.stringify(waitingList));
}
function clear(){
  localStorage.setItem("waitingList",JSON.stringify([]));
}
// 暴露出这些属性和方法
export default {
  get,
  push,
  remove,
  exist,
  clear,
}
</script>
