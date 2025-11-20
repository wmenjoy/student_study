
export function solveExpression(numbers: number[], target: number): string[] {
    const results: Set<string> = new Set();
    const EPSILON = 1e-6;

    function formatNum(n: number): string {
        return n.toString();
    }

    // Recursive solver
    // items: array of { val: number, expr: string, prec: number }
    // prec: precedence of the operator that formed this node (0 for leaf/parens, 1 for +-, 2 for */)
    // This helps decide when to add parentheses.
    type Item = { val: number; expr: string; prec: number };

    function solve(items: Item[]) {
        if (items.length === 1) {
            if (Math.abs(items[0].val - target) < EPSILON) {
                results.add(items[0].expr);
            }
            return;
        }

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items.length; j++) {
                if (i === j) continue;

                const a = items[i];
                const b = items[j];

                // Remaining items excluding a and b
                const nextItems = items.filter((_, idx) => idx !== i && idx !== j);

                // Try 4 operators
                // Addition: a + b
                // Precedence of + is 1.
                solve([
                    ...nextItems,
                    { val: a.val + b.val, expr: `${a.expr} + ${b.expr}`, prec: 1 }
                ]);

                // Subtraction: a - b
                // Precedence of - is 1. 
                // Note: subtraction is not associative/commutative in the same way, 
                // and we need to be careful about parens.
                // If right side has prec 1 (meaning it's a sum/diff), it needs parens: a - (b + c)
                // If left side is just a number or higher prec, no parens needed usually, but let's be safe.
                // Actually, standard precedence:
                // * / : 2
                // + - : 1
                // If we build "A op B", and op has precedence P.
                // If A has precedence < P, A needs parens.
                // If B has precedence < P, B needs parens.
                // Special case: - and /. 
                // A - B: if B has same precedence (e.g. C+D or C-D), it needs parens. A - (C-D).
                // A / B: if B has same precedence (e.g. C*D or C/D), it needs parens. A / (C*D).

                // To simplify, let's just wrap in parens if the inner op has lower precedence.
                // But we need to handle the "order" correctly.
                // Let's refine the expr builder.

                const wrap = (item: Item, outerPrec: number, isRight: boolean = false, isSubDiv: boolean = false) => {
                    if (item.prec < outerPrec) return `(${item.expr})`;
                    if (isRight && isSubDiv && item.prec === outerPrec) return `(${item.expr})`;
                    return item.expr;
                };

                // +
                solve([...nextItems, {
                    val: a.val + b.val,
                    expr: `${a.expr} + ${b.expr}`, // + is associative, usually safe, but strictly we might want to order? No, just keep order.
                    prec: 1
                }]);

                // *
                solve([...nextItems, {
                    val: a.val * b.val,
                    expr: `${wrap(a, 2)} × ${wrap(b, 2)}`,
                    prec: 2
                }]);

                // -
                solve([...nextItems, {
                    val: a.val - b.val,
                    expr: `${wrap(a, 1)} - ${wrap(b, 1, true, true)}`,
                    prec: 1
                }]);

                // /
                if (Math.abs(b.val) > EPSILON) {
                    solve([...nextItems, {
                        val: a.val / b.val,
                        expr: `${wrap(a, 2)} ÷ ${wrap(b, 2, true, true)}`,
                        prec: 2
                    }]);
                }
            }
        }
    }

    // However, the above "pick any two" approach allows reordering numbers (e.g. 1 2 3 4 -> 1+3 ...).
    // The problem "Fill Operators" usually implies the order of numbers is FIXED.
    // "1 2 3 4 = 0" usually means "1 ? 2 ? 3 ? 4 = 0".
    // But sometimes parentheses allow changing calculation order, but the numbers stay in sequence left-to-right?
    // Actually, standard "24 game" allows reordering.
    // But "Fill operators in 1 2 3 4" usually implies fixed order.
    // Let's check the user request: "1 2 3 4 = 0".
    // If I can reorder, it's easy. If fixed order, it's a different algorithm (insert ops between).
    // The current implementation shows numbers in fixed boxes. So I assume FIXED ORDER of numbers.
    // Parentheses allow changing operation order, but numbers appear in sequence.

    // Algorithm for Fixed Order with Parentheses:
    // We have numbers N1, N2, N3, N4.
    // We can split them at any point: (N1...Nk) op (Nk+1...Nm).
    // This is equivalent to Matrix Chain Multiplication structure.

    function solveFixed(nums: number[]): Item[] {
        if (nums.length === 1) {
            return [{ val: nums[0], expr: nums[0].toString(), prec: 3 }]; // 3 = atomic
        }

        const res: Item[] = [];

        for (let i = 1; i < nums.length; i++) {
            const leftParts = solveFixed(nums.slice(0, i));
            const rightParts = solveFixed(nums.slice(i));

            for (const l of leftParts) {
                for (const r of rightParts) {
                    // +
                    res.push({ val: l.val + r.val, expr: `${l.expr} + ${r.expr}`, prec: 1 });
                    // -
                    res.push({ val: l.val - r.val, expr: `${l.expr} - ${wrap(r, 1, true, true)}`, prec: 1 });
                    // *
                    res.push({ val: l.val * r.val, expr: `${wrap(l, 2)} × ${wrap(r, 2)}`, prec: 2 });
                    // /
                    if (Math.abs(r.val) > EPSILON) {
                        res.push({ val: l.val / r.val, expr: `${wrap(l, 2)} ÷ ${wrap(r, 2, true, true)}`, prec: 2 });
                    }
                }
            }
        }
        return res;
    }

    // Helper for wrap
    const wrap = (item: Item, outerPrec: number, isRight: boolean = false, isSubDiv: boolean = false) => {
        if (item.prec < outerPrec) return `(${item.expr})`;
        if (isRight && isSubDiv && item.prec === outerPrec) return `(${item.expr})`;
        return item.expr;
    };

    const allPossibilities = solveFixed(numbers);
    allPossibilities.forEach(p => {
        if (Math.abs(p.val - target) < EPSILON) {
            results.add(p.expr + " = " + target);
        }
    });

    return Array.from(results);
}

export type EvalStep = {
    items: (number | string)[];
    activeRange?: [number, number]; // Start and end index of the operation being performed
    result?: number; // The result of the operation
    explanation?: string;
    // For tree visualization
    treeNodes?: TreeNode[];
    newEdge?: { fromIds: string[], toId: string, op: string };
}

export type TreeNode = {
    id: string;
    val: number | string;
    x: number; // Logical x position (0 to N)
    y: number; // Logical y position (depth)
    parents?: string[]; // IDs of children nodes in the visual tree (bottom-up) -> actually let's do top-down for rendering
    // Actually, for a calculation tree:
    // Leaves are the initial numbers (at top).
    // Root is the final result (at bottom).
    // Let's track "sources" for each node.
    sources?: string[];
    op?: string; // The operator that created this node
}

export function getEvaluationSteps(numbers: number[], operators: string[]): EvalStep[] {
    // Track items with IDs to build the tree
    // We'll use a logical coordinate system.
    // Initial numbers are at y=0, x=0, 2, 4...
    // Operators are at y=0, x=1, 3, 5...

    type TrackedItem = {
        id: string;
        val: number | string;
        x: number;
        y: number;
    };

    let currentItems: TrackedItem[] = [];
    const allNodes: TreeNode[] = [];

    // Initialize
    for (let i = 0; i < numbers.length; i++) {
        const numNode = { id: `n-${i}`, val: numbers[i], x: i * 2, y: 0 };
        currentItems.push(numNode);
        allNodes.push(numNode);

        if (i < operators.length) {
            // Operators don't necessarily need to be nodes in the same list for reduction, 
            // but we need them for the logic.
            // Let's keep them in currentItems for the loop logic.
            currentItems.push({ id: `op-${i}`, val: operators[i], x: i * 2 + 1, y: 0 });
        }
    }

    const steps: EvalStep[] = [];

    // Initial state
    steps.push({
        items: currentItems.map(i => i.val),
        explanation: "准备计算...",
        treeNodes: JSON.parse(JSON.stringify(allNodes))
    });

    let stepCount = 0;

    while (currentItems.length > 1) {
        stepCount++;
        // Find priority
        let bestOpIndex = -1;
        let bestOpPrec = -1;

        for (let i = 1; i < currentItems.length; i += 2) {
            const op = currentItems[i].val as string;
            let prec = 0;
            if (op === '×' || op === '*' || op === '÷' || op === '/') prec = 2;
            else if (op === '+' || op === '-') prec = 1;

            if (prec > bestOpPrec) {
                bestOpPrec = prec;
                bestOpIndex = i;
            }
        }

        if (bestOpIndex === -1) break;

        const leftItem = currentItems[bestOpIndex - 1];
        const opItem = currentItems[bestOpIndex];
        const rightItem = currentItems[bestOpIndex + 1];

        const leftVal = leftItem.val as number;
        const op = opItem.val as string;
        const rightVal = rightItem.val as number;

        let result = 0;
        let explanation = "";

        if (op === '×' || op === '*') {
            result = leftVal * rightVal;
            explanation = `先算乘法：${leftVal} × ${rightVal} = ${result}`;
        } else if (op === '÷' || op === '/') {
            result = leftVal / rightVal;
            result = Math.round(result * 100) / 100;
            explanation = `先算除法：${leftVal} ÷ ${rightVal} = ${result}`;
        } else if (op === '+') {
            result = leftVal + rightVal;
            explanation = `再算加法：${leftVal} + ${rightVal} = ${result}`;
        } else if (op === '-') {
            result = leftVal - rightVal;
            explanation = `再算减法：${leftVal} - ${rightVal} = ${result}`;
        }

        // Create new node for the result
        // Position it between the two sources, and one level deeper
        const newY = Math.max(leftItem.y, rightItem.y) + 1;
        const newX = (leftItem.x + rightItem.x) / 2;
        const newNode: TreeNode = {
            id: `res-${stepCount}`,
            val: result,
            x: newX,
            y: newY,
            sources: [leftItem.id, rightItem.id],
            op: op // Store the operator
        };
        allNodes.push(newNode);

        // Add step highlighting the operation
        steps.push({
            items: currentItems.map(i => i.val),
            activeRange: [bestOpIndex - 1, bestOpIndex + 1],
            result,
            explanation,
            treeNodes: JSON.parse(JSON.stringify(allNodes)),
            newEdge: { fromIds: [leftItem.id, rightItem.id], toId: newNode.id, op }
        });

        // Reduce
        const newItems = [
            ...currentItems.slice(0, bestOpIndex - 1),
            { ...newNode, val: result }, // Use the new node as the item in the list
            ...currentItems.slice(bestOpIndex + 2)
        ];
        currentItems = newItems;
    }

    // Final step
    steps[steps.length - 1].explanation = "计算完成！";

    return steps;
}

export function getStrategyHint(numbers: number[], target: number): string {
    // Simple heuristics for children
    if (target === 0) {
        return "要想结果是 0，通常需要两个相同的数相减。试试看能不能凑出两个一样的数？";
    }
    if (target === 1) {
        return "要想结果是 1，可以用两个相邻的数相减，或者两个相同的数相除。";
    }
    const maxNum = Math.max(...numbers);
    if (target > maxNum * 2) {
        return "目标结果比较大，可能需要用到乘法哦！";
    }
    if (target < 0) {
        return "结果是负数？那肯定是用小数减去大数啦！";
    }
    return "观察数字的大小，大胆尝试一下吧！";
}
