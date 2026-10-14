---
kind: algorithm
title: Schwartz–Zippel 与 Freivalds 随机代数验证
updated: 2026-10-12
status: draft
order: 1062800
tags:
  - 概率
  - 期望
---

**Schwartz–Zippel**：域 $\mathbb F$ 上非零多元多项式 $P(x_1,\ldots,x_r)$，总次数不超过 $d$；有限非空集合 $S\subseteq\mathbb F$ 中独立均匀抽 $a_i$，则


$$
\boxed{\Pr\bigl(P(a_1,\ldots,a_r)=0\bigr)\le\min\!\left(1,\frac d{|S|}\right).}
$$


这是**多项式恒等性检测**单侧误判界：若两多项式真的相等，所有随机点都相等；不相等时以概率最多 $d/|S|$ 误判。独立重复 $k$ 次，误判概率至多 $\min(1,d/|S|)^k$。若多项式在选定特征的域里**恒等为零**（例如系数模 $p$ 全消失），就无法用该域发现整数/有理数意义的差异。

**Freivalds**：域或环上的同尺寸矩阵 $A,B,C$，令 $D=AB-C$。均匀独立取随机向量 $r\in\{0,1\}^n$，检验 $A(Br)=Cr$，有


$$
\boxed{AB=C\implies\Pr(Dr=0)=1;\qquad AB\ne C\implies\Pr(Dr=0)\le\frac12.}
$$


独立重复 $k$ 轮且全部通过才接受，误判概率 $\le2^{-k}$；稠密 $n\times n$ 情形每轮 $O(n^2)$。要求乘法等式、比较与随机向量实际落在**同一个数学环**中；整数溢出会破坏保证。
