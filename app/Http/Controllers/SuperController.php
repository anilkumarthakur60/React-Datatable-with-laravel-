<?php

namespace App\Http\Controllers;

use Exception;
use App\Traits\RowsPerPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Resources\Json\JsonResource;
use function request;

class SuperController extends Controller
{
    use RowsPerPage;

    public array $withAll = [];

    public array $withCount = [];

    public array $withAggregate = [];


    public function __construct(public $model, public $resource, public $storeRequest, public $updateRequest)
    {
        //        $this->middleware('permission:view-'.$this->model::PERMISSIONSLUG)->only(['index', 'show']);
        //        $this->middleware('permission:alter-'.$this->model::PERMISSIONSLUG)->only(['store', 'update']);
        //        $this->middleware('permission:delete-'.$this->model::PERMISSIONSLUG)->only(['delete']);
    }


    public function index(): JsonResource
    {
        $model = $this->model::initializer()
            ->when(property_exists($this, 'withAll') && count($this->withAll), function ($query) {
                return $query->with($this->withAll);
            })
            ->when(property_exists($this, 'withCount') && count($this->withCount), function ($query) {
                return $query->withCount($this->withCount);
            })
            ->when(property_exists($this, 'withAggregate') && count($this->withAggregate), function ($query) {
                foreach ($this->withAggregate as $key => $value) {
                    $query->withAggregate($key, $value);
                }
            });

        return $this->resource::collection($model->paginates());
    }


    public function store()
    {
        $data = resolve($this->storeRequest)->safe()->only((new $this->model())->getFillable());

        try {
            DB::beginTransaction();
            $model = $this->model::create($data);
            if (method_exists(new $this->model(), 'afterCreateProcess')) {
                $model->afterCreateProcess();
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return $this->error($e->getMessage());
        }

        return $this->resource::make($model);
        //        return $this->getResourceObject($this->resource, $model);
    }


    public function update($id)
    {
        $data = resolve($this->updateRequest)->safe()->only((new $this->model())->getFillable());

        $model = $this->model::findOrFail($id);

        try {
            DB::beginTransaction();
            $model->update($data);
            if (method_exists(new $this->model(), 'afterUpdateProcess')) {
                $model->afterUpdateProcess();
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return $this->error($e->getMessage());
        }

        return $this->resource::make($model);
        //
        //        return $this->getResourceObject($this->resource, $model);
    }


    public function show($id)
    {
        $model = $this->model::initializer()
            ->when(property_exists($this, 'withAll') && count($this->withAll), function ($query) {
                return $query->with($this->withAll);
            })
            ->when(property_exists($this, 'withCount') && count($this->withCount), function ($query) {
                return $query->withCount($this->withCount);
            })
            ->when(property_exists($this, 'withAggregate') && count($this->withAggregate), function ($query) {
                foreach ($this->withAggregate as $key => $value) {
                    $query->withAggregate($key, $value);
                }
            })
            ->findOrFail($id);

        return $this->resource::make($model);
        //        return $this->getResourceObject($this->resource, $model);
    }


    public function destroy($id): JsonResponse
    {
        $model = $this->model::findOrFail($id);
        if (method_exists(new $this->model(), 'afterDeleteProcess')) {
            $model->afterDeleteProcess();
        }
        $model->delete();

        return $this->success(message: 'Data deleted successfully');
    }


    public function delete()
    {
        request()->validate([
            'delete_rows' => ['required', 'array'],
            'delete_rows.*' => ['required', 'exists:' . (new  $this->model())->getTable() . ',id'],

        ]);

        foreach ((array) request()->input('delete_rows') as $item) {
            $model = $this->model::find($item);
            if (method_exists(new $this->model(), 'afterDeleteProcess') && $model) {
                $model->afterDeleteProcess();
            }
            if ($model) {
                $model->delete();
            }
        }

        return $this->success(message: 'Data deleted successfully');
    }
}