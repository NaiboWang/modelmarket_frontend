import JsEncrypt from 'jsencrypt'
import service from "@/plugins/axios";
// 实例化一个JSEncrypt对象
const jse = new JsEncrypt();
jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuKwpNq81z+Ds9mrfpupD47zOO
+4NIqsOGRxSsBBgH5T8OVWeu3myZEzRWOdwjesC1t5gLMnqi5uvi8rCvMepJq6yn
Owq5Ted5/Cg1HqZN7CPLFXF3wHMxp3pvy3N1dXX1nQj/UMRYYoDcti2S0Zddo5nR
sFU/u6T5SWn7tfZoCQIDAQAB
-----END PUBLIC KEY-----`);

export default jse;
