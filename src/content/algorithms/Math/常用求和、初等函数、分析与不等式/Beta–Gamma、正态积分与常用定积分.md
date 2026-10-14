---
kind: algorithm
title: Beta–Gamma、正态积分与常用定积分
updated: 2026-10-12
status: draft
order: 1121300
tags:
  - 求和
  - 微积分
  - 不等式
---

$\Gamma(z)=\int_0^\infty t^{z-1}e^{-t}\,dt$（实数 $z>0$），$B(p,q)=\int_0^1t^{p-1}(1-t)^{q-1}\,dt$（$p,q>0$）：


$$
\Gamma(z+1)=z\Gamma(z),\quad\Gamma(1/2)=\sqrt\pi,\quad B(p,q)=\frac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}.
$$



$$
\int_{-\infty}^{\infty}e^{-a x^2}\,dx=\sqrt{\frac\pi a},\quad\int_0^\infty x^{s-1}e^{-ax}\,dx=\frac{\Gamma(s)}{a^s}\quad(a,s>0).
$$



$$
\int_0^{\pi/2}\sin^m x\cos^n x\,dx=\frac12 B\left(\frac{m+1}2,\frac{n+1}2\right)\quad(m,n>-1),
$$


$$
\int_0^\pi\sin^n x\,dx=\frac{\sqrt\pi\,\Gamma((n+1)/2)}{\Gamma((n+2)/2)}\quad(n>-1).
$$


对连续随机变量的变换，必须使用 Jacobian 绝对值。例如 $Y=g(X)$ 严格单调可微、$g'\ne0$：$f_Y(y)=f_X(g^{-1}(y))/|g'(g^{-1}(y))|$；若非单调则对所有原像求和。
