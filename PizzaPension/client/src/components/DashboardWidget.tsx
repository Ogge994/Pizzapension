import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Pizza, Beer } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { SelectRegistration } from "@db/schema";

// Colors for the pie chart segments
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9EC1CF'];

interface DashboardProps {
  registrations: SelectRegistration[];
}

export function DashboardWidget({ registrations }: DashboardProps) {
  // Calculate total registrations
  const totalRegistrations = registrations.length;

  // Calculate pizza distribution
  const pizzaDistribution = registrations.reduce((acc: { name: string; value: number }[], reg) => {
    const existingPizza = acc.find(item => item.name === reg.pizza);
    if (existingPizza) {
      existingPizza.value++;
    } else {
      acc.push({ name: reg.pizza, value: 1 });
    }
    return acc;
  }, []);

  // Calculate drink distribution (group similar drinks)
  const drinkDistribution = registrations.reduce((acc: { name: string; value: number }[], reg) => {
    // Normalize drink names by converting to lowercase and trimming
    const drinkName = reg.drink.toLowerCase().trim();
    const existingDrink = acc.find(item => 
      item.name.toLowerCase() === drinkName
    );

    if (existingDrink) {
      existingDrink.value++;
    } else {
      acc.push({ name: reg.drink, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Registrations Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Totalt antal anmälningar</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRegistrations} / 18</div>
          <p className="text-xs text-muted-foreground">
            {18 - totalRegistrations} platser kvar
          </p>
        </CardContent>
      </Card>

      {/* Pizza Distribution Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pizza fördelning</CardTitle>
          <Pizza className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pizzaDistribution}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pizzaDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} st`, name]}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Drink Distribution Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Dryck fördelning</CardTitle>
          <Beer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={drinkDistribution}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {drinkDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} st`, name]}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}