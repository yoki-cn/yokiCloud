---
kind: algorithm
title: Abel 二项式恒等式
updated: 2026-10-12
status: draft
order: 1090800
tags:
  - 组合数学
  - 特殊数列
---

对 $n\ge0$，定义 $A_0(x;z)=1$、$A_k(x;z)=x(x+kz)^{k-1}$（$k\ge1$）。则


$$
(x+y+nz)^n=\sum_{k=0}^n\binom nk A_k(x;z)\,(y+(n-k)z)^{n-k}.
$$


此式保留 $k=0$ 端点时以 $A_0=1$ 解释。与 Abel 型二项式反演、Cayley 树和 Lagrange 反演有联系，但 $x,y,z$ 的记号需与具体题目统一。
