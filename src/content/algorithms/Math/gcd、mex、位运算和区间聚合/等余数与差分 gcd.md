---
kind: algorithm
title: 等余数与差分 gcd
updated: 2026-10-12
status: draft
order: 1110200
tags:
  - 数论
  - 位运算
  - 区间统计
---

整数序列 $a_1,\ldots,a_n$ 对正整数 $d$ 同余的充要条件是


$$
\boxed{d\mid G,\qquad G=\gcd_{2\le i\le n}|a_i-a_1|.}
$$


若 $G>0$，全部合法 $d$ 恰为 $G$ 的正约数；若 $G=0$，则所有元素相等，任意正 $d$ 都可行（无上界时不存在最大的有限 $d$）。相邻差分的 gcd 与全部差 $a_i-a_1$ 的 gcd 相等。
