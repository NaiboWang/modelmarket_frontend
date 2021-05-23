import JsEncrypt from 'jsencrypt'
import service from "@/plugins/axios";
// 实例化一个JSEncrypt对象
const jse = new JsEncrypt();
jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDP5daFehYHWPXLY0IlwojIh+ld
zYVn2JtfaThPR0YwY/lhHUtbhiL0Uw3t+CgFYmZ19GMKEkHZS2dZSoogAkD1Rys2
E8+vNTtJlBt92TOHXzv+Q3LWKfv372LY9i065VEcsybxyItlCGeEYLDTBg8a+iOW
v8Wj8HHf6RL/vxRcZwIDAQAB
-----END PUBLIC KEY-----`);

export default jse;
