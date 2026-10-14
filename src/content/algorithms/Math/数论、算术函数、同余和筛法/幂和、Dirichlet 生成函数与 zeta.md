---
kind: algorithm
title: 幂和、Dirichlet 生成函数与 zeta
updated: 2026-10-12
status: draft
order: 1051700
tags:
  - 数论
---

$$
\zeta(s)=\sum_{n\ge1}n^{-s}=\prod_p(1-p^{-s})^{-1}\quad(\operatorname{Re}s>1),
$$


$$
\sum_{n\ge1}\frac{\mu(n)}{n^s}=\frac1{\zeta(s)},\quad \sum_{n\ge1}\frac{\varphi(n)}{n^s}=\frac{\zeta(s-1)}{\zeta(s)},\quad\sum_{n\ge1}\frac{\tau(n)}{n^s}=\zeta(s)^2,
$$


上面 $\zeta(s)$、$\mu(n)$ 的 Dirichlet 级数、$\varphi(n)$ 的 Dirichlet 级数、$\tau(n)$ 的 Dirichlet 级数分别在 $\operatorname{Re}s>1$、$\operatorname{Re}s>1$、$\operatorname{Re}s>2$、$\operatorname{Re}s>1$ 绝对收敛；作为形式 Dirichlet 级数可用卷积关系理解，但不能无条件代入 $s=1$。
