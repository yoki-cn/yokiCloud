---
kind: algorithm
title: Bell 数的 Touchard 同余
updated: 2026-10-12
status: draft
order: 1012200
tags:
  - 组合数学
  - 计数
---

记 $B_n$ 为 Bell 数（$B_0=1$）。对素数 $p$、整数 $m\ge1,n\ge0$，在整数模 $p$ 意义下：


$$
\boxed{B_{n+p^m}\equiv B_{n+1}+mB_n\pmod p.}
$$


特别地，$B_{n+p}\equiv B_{n+1}+B_n\pmod p$。$mB_n$ 的系数是指数 $m$，并非 $p^m$；在复合模数下不能直接使用。
