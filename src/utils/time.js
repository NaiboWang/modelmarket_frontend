/**
 * 将数组里所有的mongodb的datetime格式转换成js的datetime格式
 * @param {*} o
 */
import moment from "moment";
const timezone = - new Date().getTimezoneOffset()/60 //得到当前时区
function convert_time(o) {
    for (let i in o) {
        // console.log(i,o[i])
        // eslint-disable-next-line no-prototype-builtins
        if (i.indexOf("time")>=0) {
            // console.log(o[i])
            o[i] = new Date(o[i]);
            let format = timezone<0?("-"+timezone):('+'+timezone)
            o[i] = moment(+o[i]).utcOffset(timezone).format('YYYY-MM-DD HH:mm:ss UTC'+format);
        }
        if (typeof (o[i]) == "object") {
            //going on step down in the object tree!!
            convert_time(o[i]);
        }
    }
}


/**
 * 计算d1和d2两个绝对时间在当前时区的日期相差了多少天 d1-d2
 * @param d1
 * @param d2
 * @returns {number}
 */
function get_date_difference(d1,d2){
    d1 = new Date(d1);
    d2 = new Date(d2);

    d1 = moment(+d1).utcOffset(timezone).format('YYYY-MM-DD');
    d2 = moment(+d2).utcOffset(timezone).format('YYYY-MM-DD');
    // let difValue = (d1 - d2) / (1000 * 60 * 60 * 24); // 日期绝对值，与时区无关，比如返回0.67天
    let d11 = new Date(d1.toString());
    let d22 = new Date(d2.toString());
    let difValue = (d11 - d22)/(1000*60*60*24); //转换时区之后的算法
    return difValue
}
export {convert_time,get_date_difference}
