---
kind: algorithm
title: Fibonacci、Lucas 与矩阵恒等式
updated: 2026-10-12
status: draft
order: 1090100
tags:
  - 组合数学
  - 特殊数列
---

$F_0=0,F_1=1,F_{n+2}=F_{n+1}+F_n$；$L_0=2,L_1=1,L_{n+2}=L_{n+1}+L_n$。设 $\phi=(1+\sqrt5)/2,\psi=(1-\sqrt5)/2$。


$$
F_n=\frac{\phi^n-\psi^n}{\sqrt5},\qquad L_n=\phi^n+\psi^n,
$$


$$
\sum_{k=0}^nF_k=F_{n+2}-1,\quad\sum_{k=0}^nF_k^2=F_nF_{n+1},\quad\sum_{k=0}^nkF_k=nF_{n+2}-F_{n+3}+2.
$$


$$
F_{m+n}=F_mF_{n+1}+F_{m-1}F_n\quad(m\ge1,n\ge0),
$$


$$
F_{2n}=F_nL_n,\quad F_{2n+1}=F_n^2+F_{n+1}^2,\quad F_{n+1}F_{n-1}-F_n^2=(-1)^n.
$$


$$
\gcd(F_m,F_n)=F_{\gcd(m,n)}\quad(m,n\ge1),\qquad L_n^2-5F_n^2=4(-1)^n.
$$



$$
\sum_{n\ge0}F_nx^n=\frac{x}{1-x-x^2},\quad\sum_{n\ge0}L_nx^n=\frac{2-x}{1-x-x^2},
$$


$$
\begin{pmatrix}1&1\\1&0\end{pmatrix}^n=\begin{pmatrix}F_{n+1}&F_n\\F_n&F_{n-1}\end{pmatrix}\quad(n\ge1).
$$
