---
kind: algorithm
title: 二次剩余、Legendre 符号与二次互反律
updated: 2026-10-12
status: draft
order: 1051100
tags:
  - 数论
---

对奇素数 $p$ 且 $p\nmid a$，Legendre 符号


$$
\left(\frac ap\right)\equiv a^{(p-1)/2}\pmod p\ \in\{-1,1\},
$$


等于 $1$ 当且仅当 $a$ 是模 $p$ 的非零平方。若 $p\equiv3\pmod4$ 且 $a$ 是二次剩余，则


$$
\sqrt a\equiv\pm a^{(p+1)/4}\pmod p.
$$


二次互反律（奇素数 $p,q$ 不同）：


$$
\left(\frac pq\right)\left(\frac qp\right)=(-1)^{\frac{p-1}2\frac{q-1}2},\quad\left(\frac{-1}p\right)=(-1)^{(p-1)/2},\quad\left(\frac2p\right)=(-1)^{(p^2-1)/8}.
$$


若 $p=2$，只有剩余类 $0,1$；对合数模数的平方根必须先分解素数幂再 CRT 合并（可能无解或有多个解）。Jacobi 符号为 $1$ **不保证**合数模数下有平方根。
