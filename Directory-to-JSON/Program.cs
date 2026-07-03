using System.Text.Json;

Console.WriteLine("Enter Directory: ");
bool input = false;
string path = "";
do
{
    try
    {
        path = Console.ReadLine()!;
        input = true;
    }
    catch (Exception x)
    {
        Console.WriteLine(x);
    }
} while (!input);

// Read Directory
string?[] files = Directory.GetFiles(path)
                            .Select(Path.GetFileName)
                            .ToArray();

File.WriteAllText(
    "songNames.json",
    JsonSerializer.Serialize(files, new JsonSerializerOptions { WriteIndented = true })
);