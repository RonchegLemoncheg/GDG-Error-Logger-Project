using BugLensLogger;

namespace ConsoleApp1;

class Program
{
    static void Main(string[] args)
    {
        Logger.Init();
        string x = null;
        GetId(x);
    }

    static void GetId(string x)
    {
        Console.WriteLine(x.Length);
    }
}