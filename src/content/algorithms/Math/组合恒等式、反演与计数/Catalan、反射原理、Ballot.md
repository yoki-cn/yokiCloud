---
kind: algorithm
title: Catalan、反射原理、Ballot
updated: 2026-10-12
status: draft
order: 1010900
tags:
  - 组合数学
  - 计数
---

$$
C_n=\frac1{n+1}\binom{2n}{n}=\binom{2n}n-\binom{2n}{n+1},\quad C_0=1,
$$


$$
C_{n+1}=\sum_{k=0}^n C_kC_{n-k},\qquad C(x)=\sum_{n\ge0}C_nx^n=\frac{1-\sqrt{1-4x}}{2x}.
$$


在从 $(0,0)$ 走到 $(p,q)$ 的仅向右、向上路径中，若 $p\ge q\ge0$ 且每个前缀右步数不小于上步数，则


$$
\#=\binom{p+q}{q}-\binom{p+q}{q-1}=\frac{p-q+1}{p+1}\binom{p+q}q.
$$


一维对称随机游走从 $x\ge0$ 到 $y\ge0$，在 $t$ 步内始终不低于零的路径数（奇偶合法）为


$$
\binom t{(t+y-x)/2}-\binom t{(t+y+x+2)/2}.
$$


**Fuss–Catalan**：$m\ge1$、$n\ge0$，满足 $C=1+x C^{m+1}$ 的系数


$$
[x^n]C(x)=\frac1{mn+1}\binom{(m+1)n}{n}.
$$



**格路经过指定点与严格投票**。从 $(0,0)$ 到 $(a,b)$ 仅向右或向上（$a,b\ge0$）共有 $\binom{a+b}a$ 条路径。若必须经过 $(x,y)$，其中 $0\le x\le a,\ 0\le y\le b$，则


$$
\#\text{经过 }(x,y)=\binom{x+y}x\binom{a+b-x-y}{a-x}.
$$


若 $a>b\ge0$，由 $a$ 张 $A$ 票、$b$ 张 $B$ 票组成的序列中，要求在**每个非空前缀**里 $A$ 票严格多于 $B$ 票，则（Bertrand 投票定理）


$$
\boxed{\#\text{严格领先}=\frac{a-b}{a+b}\binom{a+b}a.}
$$


它与本节前述 $p\ge q$ 时“右步始终不小于上步”的**非严格**条件不同，不能混用。

**Raney 引理（循环移位计数）**：整数 $a_1,\ldots,a_n\le1$ 且 $\sum_i a_i=r>0$，把每个起点视为一个**带位置的循环移位**，则恰有 $r$ 个起点满足该移位的**所有非空前缀和严格为正**；即使数值周期重复，仍按起点分别计数。适用于循环引理、Lukasiewicz 路径、有序树编码及严格投票的扩展；必须同时检查整数、上界 $a_i\le1$ 和总和 $r>0$。
