<?php
use Carbon\Carbon;
use Carbon\CarbonInterval;
use Illuminate\Support\Str;

if (! function_exists('_dd')) {
    /*
     * Dump the passed variables and end the script.
     *
     * @param  mixed  $args
     * @return void
     */
    function _dd(...$args)
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: *');
        header('Access-Control-Allow-Headers: *');
        http_response_code(500);

        foreach ($args as $x) {
            (new Symfony\Component\VarDumper\VarDumper())->dump($x);
        }

        exit(1);
    }
}

if (! function_exists('shortName')) {
    /**
     * @return string
     *
     * @throws ReflectionException
     */
    function shortName($param)
    {
        if (! app($param)) {
            return null;
        }
        $reflection = new ReflectionClass(app($param));

        return $reflection->getShortName();
    }
}


if (! function_exists('totalSeconds')) {
    /**
     * @return string
     */
    function totalSeconds($times): mixed
    {
        $time = explode(':', $times);

        if (count($time) >= 3) {
            $carbon = new Carbon($times);
            $seconds = $carbon->diffInSeconds(Carbon::createFromFormat('H:i:s', '00:00:00'));
        } elseif (count($time) == 2) {
            $minSec = '00:'.$times;
            $carbon = new Carbon($minSec);
            $seconds = $carbon->diffInSeconds(Carbon::createFromFormat('H:i:s', '00:00:00'));
        } else {
            $seconds = $times;
        }

        return $seconds;
    }
}
if (! function_exists('duration')) {
    /**
     * @throws Exception
     */
    function duration($duration): mixed
    {
        //        $interval = CarbonInterval::seconds($duration)->cascade();
        //        return $output = sprintf('%dh %dm', $interval->totalHours, $interval->toArray()['minutes']);

        return CarbonInterval::second($duration)->cascade()->forHumans();
    }
}

if (! function_exists('dateForHumans')) {
    /**
     * @throws Exception
     */
    function dateForHumans($date): mixed
    {
        if ($date) {
            return Carbon::parse($date)->diffForHumans();
        }

        return null;
    }
}

if (! function_exists('ymdDate')) {
    /**
     * @throws Exception
     */
    function ymdDate($date, $format = 'Y-m-d'): mixed
    {
        if ($date) {
            return Carbon::parse($date)->format($format);
        }

        return null;
    }
}

if (! function_exists('dateForReports')) {
    function dateForReports($date, $format = 'Y-m-d H:i'): mixed
    {
        if ($date) {
            return Carbon::parse($date)->format($format);
        }

        return null;
    }
}
if (! function_exists('getSqlQuery')) {
    function getSqlQuery($sql): mixed
    {
        $query = str_replace(['?'], ['\'%s\''], $sql->toSql());

        return vsprintf($query, $sql->getBindings());
    }
}
if (! function_exists('getFilterByKey')) {
    /**
     * @throws Exception
     */
    function getFilterByKey($key = 'date')
    {
        $jsonData = json_decode(request()->query('filters'));
        $value = collect($jsonData)->get($key);

        return $value ?? false;
    }
}
if (! function_exists('getArrayFilterByKey')) {
    /**
     * @throws Exception
     */
    function getArrayFilterByKey($key = 'date')
    {
        $jsonData = json_decode(request()->query('filters'));
        $value = collect($jsonData)->get($key);

        return flatData($value) ?? [];
    }
}

if (! function_exists('flatData')) {
    /**
     * @throws Exception
     */
    function flatData($data, $depth = 0): array
    {
        return collect($data)->flatten($depth)->toArray();
    }
}

if (! function_exists('descending')) {
    function descending($value = null): string
    {
        if ($value === true) {
            return 'DESC';
        }

        return json_decode(request()->query('descending')) ? 'DESC' : 'ASC';
    }
}
if (! function_exists('defaultSort')) {
    function defaultSort($key = 'id'): string
    {
        return  request()->query('sortBy', $key);
    }
}

if (! function_exists('parseFormula')) {
    /**
     * @throws Exception
     */
    function parseFormula($q)
    {
        $dom = new \DOMDocument(); // initialize the domdocument
        @$dom->loadHTML($q, LIBXML_NOWARNING | LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $items = $dom->getElementsByTagName('ki');
        foreach ($items as $item) {
            if (empty($item->nodeValue)) {
                $item->nodeValue = '$'.$item->getAttribute('src').'$';
            }
        }

        return $dom->saveHTML();
    }
}
