<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use Throwable;

trait RowsPerPage
{
    use ValidatesRequests;

    public function getResourceCollection($class, Builder $builder, bool $simplePaginate = false)
    {
        try {
            return $class::collection($this->paginateData($builder, $simplePaginate));
        } catch (Throwable $exception) {
            dd(' getResourceCollection exception', $exception);
        }
    }

    public function paginateData(Builder $builder, bool $simplePaginate = false)
    {
        try {
            if ($simplePaginate) {
                return $builder->simplePaginate($this->per_page($builder));
            }

            return $builder->paginate($this->per_page($builder));
        } catch (Throwable $exception) {
            dd(' paginateData exception', $exception->getMessage(), $exception);
        }
    }

    public function per_page(Builder $builder): int
    {
        $request = request();
        $this->validate($request, [
            'per_page' => 'nullable|numeric|gte:0|lte:10000',
        ]);
        if ($request->query('per_page') === 0) {
            return $builder->count();
        }

        return $request->query('per_page', 10);
    }

    public function getResourceObject($class, $object): JsonResource
    {
        try {
            return $class::make($object);
        } catch (Throwable $exception) {
            dd(' getResourceObject exception', $exception->getMessage(), $exception);
        }
    }

    //
    //    public function checkPermission(...$permission): void
    //    {
    //        if (! auth()->user()->can($permission)) {
    //            abort(403, 'unauthorized_access');
    //        }
    //    }
    //
    //
    //    public function checkRole(...$roles): void
    //    {
    //        if (! auth()->user()->hasRole($roles)) {
    //            abort(403, 'unauthorized_access');
    //        }
    //    }

    public function error(
        $message = 'Something went wrong',
        $data = [],
        $code = ResponseAlias::HTTP_INTERNAL_SERVER_ERROR,
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    public function success(
        $message = 'Data fetched successfully',
        $data = [],
        $code = ResponseAlias::HTTP_OK,
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
