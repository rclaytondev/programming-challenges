import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const MODULO = 10 ** 10;
const solve = () => {
	return (28433 * MathUtils.modularExponentiate(2, 7830457, MODULO) + 1) % MODULO;
};
