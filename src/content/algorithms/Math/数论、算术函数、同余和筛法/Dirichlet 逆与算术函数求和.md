---
kind: algorithm
title: Dirichlet 逆与算术函数求和
updated: 2026-10-12
status: draft
order: 1051400
tags:
  - 数论
---

若 $f(1)\ne0$ 且数值所在环中 $f(1)$ 可逆，则存在唯一的 Dirichlet 逆 $f^{-1}$，满足 $f*f^{-1}=\varepsilon$。递推：


$$
f^{-1}(1)=f(1)^{-1},\quad f^{-1}(n)=-f(1)^{-1}\sum_{\substack{d\mid n\\d>1}}f(d)f^{-1}(n/d).
$$


如果 $f*g=h$，设前缀和 $F(n)=\sum_{i\le n}f(i)$，$H(n)=\sum_{i\le n}h(i)$，则


$$
H(n)=\sum_{d=1}^n g(d)F\!\left(\left\lfloor\frac nd\right\rfloor\right).
$$


杜教筛常利用 $g(1)\ne0$ 将 $F(n)$ 单独移项，在同商区间合并求和，典型在 $O(n^{2/3})$ 附近工作（具体依赖预处理规模与目标函数）。
