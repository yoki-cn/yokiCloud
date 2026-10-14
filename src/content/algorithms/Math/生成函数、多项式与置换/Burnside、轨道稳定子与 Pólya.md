---
kind: algorithm
title: Burnside、轨道稳定子与 Pólya
updated: 2026-10-12
status: draft
order: 1020600
tags:
  - 生成函数
  - 多项式
  - 群论
---

群 $G$ 有限地作用于有限集合 $X$，轨道稳定子公式与 Burnside 为


$$
|G|=|\operatorname{Orb}(x)|\,|\operatorname{Stab}(x)|,\quad |X/G|=\frac1{|G|}\sum_{g\in G}|\operatorname{Fix}_X(g)|.
$$


若 $g$ 作用于 $n$ 个位置，其循环数为 $c(g)$，用 $q$ 种颜色任意着色，则固定方案数为 $q^{c(g)}$：


$$
\#\text{不等价着色}=\frac1{|G|}\sum_{g\in G}q^{c(g)}.
$$


循环指标及其权重替换：


$$
Z_G(a_1,\ldots,a_n)=\frac1{|G|}\sum_{g\in G}\prod_{j=1}^n a_j^{c_j(g)},
$$


$$
\text{颜色权重 }w_1,\ldots,w_q:\qquad Z_G\left(\sum_i w_i,\sum_iw_i^2,\ldots,\sum_iw_i^n\right).
$$


取某些颜色使用次数时，取对应 $w_i$ 的系数；带相邻限制或全局限制的着色不能未经验证直接用 $q^{c(g)}$。


**带权 Burnside**：若权函数 $w:X\to R$ 在群作用下不变，即 $w(g\cdot x)=w(x)$，并在特征为 $0$ 的数域或群阶可逆的环中，则


$$
\boxed{\sum_{O\in X/G} w(O)=\frac1{|G|}\sum_{g\in G}\sum_{x\in\operatorname{Fix}(g)}w(x).}
$$


**使用场景**：统计每个本质不同染色方案的权重（如每种颜色固定乘法权重），而不是只求方案数。权值不在群作用下保持不变时不能直接应用。

**对称计数先确认作用集合**：在有限集合 $X$ 上，群作用满足 $e\cdot x=x$、$(gh)\cdot x=g\cdot(h\cdot x)$；$\operatorname{Orb}(x)=\{g\cdot x:g\in G\}$ 是一种本质方案，$\operatorname{Stab}(x)=\{g:g\cdot x=x\}$ 是保持这个方案不变的操作，$\operatorname{Fix}(g)=\{x:g\cdot x=x\}$ 是被某个操作保持的方案。

**不能机械除以 $|G|$**：仅在对每个对象都满足 $\operatorname{Stab}(x)=\{e\}$（自由作用）时，所有轨道大小才均为 $|G|$。只有一个轨道称为传递作用；非单位元不同时固定所有位置称为忠实作用。自由作用蕴含忠实，反向不成立。

**题型识别**：只旋转用 $C_n$；旋转和翻转用 $D_n$；任意重排用 $S_n$ 或其子群；先按群元素的置换环型分组，再计算固定方案。固定颜色用量时通常转向循环指标而非 $q^{c(g)}$。
