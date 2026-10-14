---
kind: algorithm
title: 阶梯 Nim 与 Fibonacci Nim
updated: 2026-10-12
status: draft
order: 1101200
tags:
  - 博弈论
---

**阶梯 Nim**：水平层级 $0,1,\dots,m$，第 $0$ 层为不可操作的终点，每步从某一正编号层向前一层移动任意正数颗石子；无法操作者输。第 $i$ 层石子数 $a_i$ 满足


$$
\boxed{\text{必败}\iff a_1\oplus a_3\oplus a_5\oplus\cdots=0.}
$$


只异或奇数编号层（距离终点为奇数），不包括第 $0$ 层；改动操作方向、距离、目标层后结论未必成立。

**Fibonacci Nim**：初始 $n>1$ 颗，先手首步只能取 $1\le x<n$ 颗；此后每步最多取上一步数量的两倍，至少取一颗，取完最后一颗者胜。其必败初值为


$$
\boxed{n\in\{2,3,5,8,13,\ldots\}\iff n\text{ 是 Fibonacci 数（取 }F_2=1,F_3=2\text{ 起）。}}
$$


此结论高度依赖**首步不能取完**与后续的两倍限制；将首步改为也可全部取走则任意 $n>0$ 先手直接获胜。
