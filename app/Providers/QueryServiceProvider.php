<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Closure;
use Illuminate\Support\Str;
use Illuminate\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
class QueryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {

        Builder::macro('likeWhere', function ($attributes, string $searchTerm = NULL) {
            $this->where(function (Builder $query) use ($attributes, $searchTerm) {
                foreach ($attributes as $attribute) {
                    $query->when(
                        str_contains($attribute, '.'),
                        function (Builder $query) use ($attribute, $searchTerm) {
                            [$relationName, $relationAttribute] = explode('.', $attribute);
                            $query->orWhereHas($relationName, function (Builder $query) use ($relationAttribute, $searchTerm) {
                                $query->where($relationAttribute, 'LIKE', "%{$searchTerm}%");
                            });
                        },
                        function (Builder $query) use ($attribute, $searchTerm) {
                            $query->orWhere($attribute, 'LIKE', "%{$searchTerm}%");
                        }
                    );
                }
            });

            return $this;
        });

        Builder::macro('likeEqual', function ($attributes, string $searchTerm = NULL) {
            $this->where(function (Builder $query) use ($attributes, $searchTerm) {
                foreach ($attributes as $attribute) {
                    $query->when(
                        str_contains($attribute, '.'),
                        function (Builder $query) use ($attribute, $searchTerm) {
                            [$relationName, $relationAttribute] = explode('.', $attribute);
                            $query->whereHas($relationName, function (Builder $query) use ($relationAttribute, $searchTerm) {
                                $query->where($relationAttribute, $searchTerm);
                            });
                        },
                        function (Builder $query) use ($attribute, $searchTerm) {
                            $query->where($attribute, $searchTerm);
                        }
                    );
                }
            });

            return $this;
        });



        //use on risk
        Builder::macro('withCountWhereHas', function ($relation, Closure $callback = NULL, $operator = '>=', $count = 1) {
            $this->whereHas(Str::before($relation, ':'), $callback, $operator, $count)
                ->withCount(relations: $callback ? [$relation => fn($query) => $callback($query)] : $relation);

            return $this;
        });

        Builder::macro('paginates', function (int $perPage = NULL, $columns = ['*'], $pageName = 'page', int $page = NULL) {
            request()->validate(['rowsPerPage' => 'nullable|numeric|gte:0|lte:1000000000000000000']);

            $page = $page ?: Paginator::resolveCurrentPage($pageName);

            $total = $this->toBase()->getCountForPagination();

            if ($perPage === NULL) {
                $rows = (int) request()->query('rowsPerPage', 20);
                if ($rows === 0) {
                    $perPage = $total;
                } else {
                    $perPage = $rows;
                }
            }
            $results = $total
                ? $this->forPage($page, $perPage)->get($columns)
                : $this->model->newCollection();

            return $this->paginator($results, $total, $perPage, $page, [
                'path' => Paginator::resolveCurrentPath(),
                'pageName' => $pageName,
            ]);
        });

        Builder::macro('simplePaginates', function (int $perPage = NULL, $columns = ['*'], $pageName = 'page', $page = NULL) {
            request()->validate(['rowsPerPage' => 'nullable|numeric|gte:0|lte:1000000000000000000']);
            $page = $page ?: Paginator::resolveCurrentPage($pageName);

            if ($perPage === NULL) {
                $rows = (int) request()->query('rowsPerPage', 20);
                if ($rows === 0) {
                    $perPage = $this->count();
                } else {
                    $perPage = $rows;
                }
            }

            $this->offset(($page - 1) * $perPage)->limit($perPage + 1);

            return $this->simplePaginator($this->get($columns), $perPage, $page, [
                'path' => Paginator::resolveCurrentPath(),
                'pageName' => $pageName,
            ]);
        });
        //
    }
}
