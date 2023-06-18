import { evaluateRPN } from "@utils/rpn";

/**
 * Static class, which links static evaluable expressions
 */
export class ExpressionsContainer {

    /**
     * Class is not constructable
     */
    private constructor() {};

    /**
     * Reversed polish notation
     */
    public static RPN(testValue: string, expectedValue: number) {
        return evaluateRPN(testValue) === expectedValue;
    }
}


export const ExpressionMap = {
    [ExpressionsContainer.RPN.name]: {
        func: ExpressionsContainer.RPN,
    }
} as const;
