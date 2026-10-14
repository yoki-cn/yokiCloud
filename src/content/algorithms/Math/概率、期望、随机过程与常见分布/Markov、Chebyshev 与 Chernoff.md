---
kind: algorithm
title: Markov、Chebyshev 与 Chernoff
updated: 2026-10-12
status: draft
order: 1061500
tags:
  - 概率
  - 期望
---

$X\ge0$ 且 $a>0$：


$$
\Pr(X\ge a)\le\frac{\mathbb EX}{a}\quad\text{(Markov)}.
$$


若 $\operatorname{Var}X<\infty$，$t>0$：


$$
\Pr(|X-\mathbb EX|\ge t)\le\frac{\operatorname{Var}X}{t^2}\quad\text{(Chebyshev)}.
$$


独立 Bernoulli 和 $X$，$\mu=\mathbb EX$、$\delta>0$：


$$
\Pr(X\ge(1+\delta)\mu)\le\left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^\mu,
$$


$$
\Pr(X\le(1-\delta)\mu)\le e^{-\mu\delta^2/2}\qquad(0<\delta<1).
$$


独立有界 $X_i\in[a_i,b_i]$ 的 Hoeffding：


$$
\Pr\left(\sum_i(X_i-\mathbb EX_i)\ge t\right)\le\exp\left(-\frac{2t^2}{\sum_i(b_i-a_i)^2}\right).
$$

**Chernoff 常用简化上尾**（仍要求 $X$ 是独立 Bernoulli 和、$\mu=\mathbb EX$）：


$$
\Pr(X\ge(1+\delta)\mu)\le\exp\!\left(-\frac{\mu\delta^2}{2+\delta}\right)\qquad(\delta>0).
$$


**Hoeffding 双侧形式**（独立、几乎处处 $a_i\le X_i\le b_i$，且 $t>0$）：


$$
\boxed{\Pr\!\left(\left|\sum_i(X_i-\mathbb EX_i)\right|\ge t\right)\le2\exp\!\left(-\frac{2t^2}{\sum_i(b_i-a_i)^2}\right).}
$$


**Jensen**：$\varphi$ 为凸函数，$X$ 可积且两侧期望存在，则 $\varphi(\mathbb EX)\le\mathbb E\varphi(X)$；凹函数反向。**概率版 Cauchy–Schwarz**（二阶矩存在）：


$$
\boxed{|\mathbb E(XY)|^2\le\mathbb E(X^2)\mathbb E(Y^2).}
$$
