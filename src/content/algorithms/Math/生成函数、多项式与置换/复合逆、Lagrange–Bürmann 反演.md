---
kind: algorithm
title: 复合逆、Lagrange–Bürmann 反演
updated: 2026-10-12
status: draft
order: 1020900
tags:
  - 生成函数
  - 多项式
  - 群论
---

若 $w=x\Phi(w)$，$\Phi(0)\ne0$，则对 $n\ge1$：


$$
[x^n]w(x)^k=\frac kn[t^{n-k}]\Phi(t)^n\quad(k\ge1),
$$


$$
[x^n]F(w(x))=\frac1n[t^{n-1}]F'(t)\Phi(t)^n.
$$


若 $f(0)=0,f'(0)\ne0$、$g(f(x))=x$，则复合逆 $g=f^{\langle-1\rangle}$ 满足


$$
[x^n]g(x)^k=\frac kn[t^{n-k}]\left(\frac t{f(t)}\right)^n.
$$


乘法逆 $1/f(x)$ 与复合逆 $f^{\langle-1\rangle}(x)$ 完全不同；后者的常数项必为 $0$。
