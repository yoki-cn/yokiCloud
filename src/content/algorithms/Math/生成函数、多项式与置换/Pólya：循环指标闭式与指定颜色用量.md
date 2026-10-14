---
kind: algorithm
title: Pólya：循环指标闭式与指定颜色用量
updated: 2026-10-12
status: draft
order: 1022100
tags:
  - 生成函数
  - 多项式
  - 群论
---

令 $G$ 作用在 $n$ 个位置上，$c_d(g)$ 为操作 $g$ 的长度恰为 $d$ 的置换环数。循环指标已在 2.6 定义，记 $a_d$ 为**长度为 $d$ 的单个环**的权重。对 $n\ge3$，


$$
\boxed{Z_{C_n}(a_1,\ldots,a_n)=\frac1n\sum_{d\mid n}\varphi(d)a_d^{n/d}.}
$$


$$
\boxed{Z_{D_n}=\begin{cases}
\dfrac{1}{2n}\left(\displaystyle\sum_{d\mid n}\varphi(d)a_d^{n/d}+na_1a_2^{(n-1)/2}\right),&n\text{ 奇},\\[2mm]
\dfrac{1}{2n}\left(\displaystyle\sum_{d\mid n}\varphi(d)a_d^{n/d}+\dfrac n2a_1^2a_2^{(n-2)/2}+\dfrac n2a_2^{n/2}\right),&n\text{ 偶}.
\end{cases}}
$$


将每个 $a_d$ 换成 $q$ 就是无约束 $q$ 色染色（2.7）；颜色 $j$ 有形式权 $x_j$ 时，换成 $a_d=\sum_jx_j^d$，取 $[x_1^{k_1}\cdots x_q^{k_q}]$ 就得到每色数量恰好为 $k_j$ 的轨道数；**颜色名字依然可区分**，只有位置由群操作变化。

**二色项链恰有 $k$ 个黑点**：令 $a_d=1+x^d$。对 $0\le k\le n$，


$$
\boxed{\#\text{二色旋转项链且黑点数 }k=\frac1n\sum_{d\mid\gcd(n,k)}\varphi(d)\binom{n/d}{k/d}.}
$$


更多颜色但只追踪指定一种颜色，则 $a_d=(q-1)+x^d$；若每种颜色带乘法权重 $w_j$，则 $a_d=\sum_j w_j^d$。固定一类环长为 $d$ 的环可以整体选黑或白，因而**某个操作**的固定染色系数是


$$
[x^k]\prod_{d\ge1}(1+x^d)^{c_d(g)}.
$$


当 $k$ 较小而给定各环长度时，背包可快速求上述系数（`cnt[d]` 是长度为 $d$ 的环的个数；`T` 支持加法）：

```cpp
template<class T>
vector<T> cycle_knapsack(const vector<int> &cnt, int k) {
    vector<T> f(k + 1);
    f[0] = 1;
    for (int d = 1; d < (int)cnt.size() && d <= k; ++ d) {
        for (int t = 0; t < cnt[d]; ++ t) {
            for (int s = k; s >= d; -- s) f[s] += f[s - d];
        }
    }
    return f;
}
```

这是**单个群元素固定方案数**的计算，不是最终本质方案数；还需乘对应环型的群元素数，全部相加并除以 $|G|$。若位置之间有相邻异色、禁止子串、图约束等耦合，简单代入 $a_d=\sum_j x_j^d$ 不一定成立；应回到 Burnside，重新计算每个操作下的 $\operatorname{Fix}(g)$。

**使用场景**：只问本质不同颜色串数量→Burnside；问恰好 $k$ 个黑点→上述项链闭式；所有颜色的使用量均给定→多元循环指标／多维 DP；只有某一种颜色需要追踪→一元生成函数。**模意义下除以 $|G|$ 时必须检查逆元**；若不互质，须用整除或更高模数等精确方法，不可直接作除法。
